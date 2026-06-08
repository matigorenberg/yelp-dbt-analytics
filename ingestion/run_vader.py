"""
run_vader.py — materialize-first VADER sentiment scorer.

Materializes stg_review (a dbt view) into a physical table before batching,
so LIMIT/OFFSET operates on stored column chunks rather than re-executing the
view from raw JSON on every iteration.
"""

import time

import duckdb
import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

DB_PATH = r"C:\Users\matig\data_analytics\yelp_analytics_project\data\yelp.duckdb"
BATCH_SIZE = 50_000
TEST_LIMIT = None  # set to None to score all reviews


def _score_batch(df: pd.DataFrame, analyzer: SentimentIntensityAnalyzer) -> pd.DataFrame:
    scores = df["review_text"].apply(analyzer.polarity_scores)
    return pd.DataFrame(
        {
            "review_id":      df["review_id"].values,
            "business_id":    df["business_id"].values,
            "vader_compound": [s["compound"] for s in scores],
            "vader_pos":      [s["pos"]      for s in scores],
            "vader_neu":      [s["neu"]      for s in scores],
            "vader_neg":      [s["neg"]      for s in scores],
        }
    )


def run(test_limit: int | None = TEST_LIMIT) -> None:
    con = duckdb.connect(DB_PATH)
    analyzer = SentimentIntensityAnalyzer()

    con.execute("""
        CREATE OR REPLACE TABLE review_sentiment (
            review_id      VARCHAR,
            business_id    VARCHAR,
            vader_compound FLOAT,
            vader_pos      FLOAT,
            vader_neu      FLOAT,
            vader_neg      FLOAT
        )
    """)

    # Materialize the view into a physical table so LIMIT/OFFSET skips column
    # chunks instead of re-running the full view scan on every iteration.
    print("Materializing stg_review...", flush=True)
    mat_start = time.time()
    # Join with stg_business to restrict scoring to restaurant reviews only.
    restaurant_reviews = """
        SELECT r.review_id, r.business_id, r.review_text
        FROM stg_review r
        INNER JOIN stg_business b USING (business_id)
    """
    source = f"({restaurant_reviews})" if not test_limit else f"({restaurant_reviews} LIMIT {test_limit})"
    con.execute(f"CREATE OR REPLACE TABLE _reviews_staging AS SELECT review_id, business_id, review_text FROM {source}")
    print(f"Materialized in {time.time() - mat_start:.1f}s", flush=True)

    total = con.execute("SELECT COUNT(*) FROM _reviews_staging").fetchone()[0]
    print(f"Scoring {total:,} reviews in batches of {BATCH_SIZE:,}...", flush=True)

    processed = 0
    offset = 0
    start = time.time()

    while True:
        batch_df = con.execute(
            "SELECT review_id, business_id, review_text FROM _reviews_staging LIMIT ? OFFSET ?",
            [BATCH_SIZE, offset],
        ).fetchdf()

        if batch_df.empty:
            break

        result_df = _score_batch(batch_df, analyzer)
        con.execute("INSERT INTO review_sentiment SELECT * FROM result_df")

        processed += len(batch_df)
        offset += len(batch_df)
        elapsed = time.time() - start
        rate = processed / elapsed
        eta = (total - processed) / rate if rate > 0 else 0
        print(f"  {processed:>8,} / {total:,}  |  {rate:,.0f} rev/sec  |  ~{eta / 60:.1f} min left", flush=True)

    con.execute("DROP TABLE _reviews_staging")
    elapsed_total = time.time() - start
    print(f"\nDone in {elapsed_total:.1f}s ({elapsed_total / 60:.1f} min) — {processed:,} rows written to review_sentiment.", flush=True)
    con.close()


if __name__ == "__main__":
    run()
