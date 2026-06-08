import duckdb
import os

RAW_DIR = r"C:\Users\matig\data_analytics\yelp_analytics_project\data\raw\Yelp JSON"
DB_PATH = r"C:\Users\matig\data_analytics\yelp_analytics_project\data\yelp.duckdb"

FILES = {
    "raw_business": "yelp_academic_dataset_business.json",
    "raw_review":   "yelp_academic_dataset_review.json",
    "raw_tip":      "yelp_academic_dataset_tip.json",
}

def load():
    con = duckdb.connect(DB_PATH)

    for table, filename in FILES.items():
        path = os.path.join(RAW_DIR, filename)
        size_mb = os.path.getsize(path) / 1_000_000
        print(f"Loading {filename} ({size_mb:.0f} MB) -> table '{table}'...")

        # read_json_auto infers the schema and handles newline-delimited JSON (NDJSON)
        con.execute(f"""
            CREATE OR REPLACE TABLE {table} AS
            SELECT * FROM read_json_auto('{path}', format='newline_delimited')
        """)

        count = con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"  {count:,} rows loaded.")

    con.close()
    print("\nDone. Database saved to:", DB_PATH)

if __name__ == "__main__":
    load()
