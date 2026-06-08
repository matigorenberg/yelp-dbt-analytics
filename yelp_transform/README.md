# yelp_transform

dbt project for the Yelp Analytics pipeline. Transforms raw Yelp Open Dataset JSON (loaded into DuckDB) into analytics-ready marts.

## Layers

| Layer | Materialization | Models |
|---|---|---|
| Staging | View | `stg_business`, `stg_review`, `stg_tip` |
| Intermediate | View | `int_business_sentiment` |
| Marts | Table | `mart_restaurants`, `mart_cuisine_summary` |

## Key model: `mart_restaurants`

One row per restaurant. Includes cuisine classification (17 categories, pattern-matched from the `categories` field) and a `hidden_gem_score`:

```sql
CASE
  WHEN review_count_actual >= 20 AND avg_sentiment IS NOT NULL
  THEN round(avg_sentiment / ln(review_count_actual + 2), 4)
END
```

`avg_sentiment` is the mean VADER compound score across all reviews for that business (pre-computed by `ingestion/run_vader.py`). The denominator penalizes popularity so high-sentiment places with fewer reviews score above equally-rated but heavily-reviewed ones.

## Running

```bash
# from this directory, using the project venv
../.venv/Scripts/dbt run
../.venv/Scripts/dbt test
```
