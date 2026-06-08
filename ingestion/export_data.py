import duckdb
import json
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "data" / "yelp.duckdb"
OUT_DIR = Path(__file__).parent.parent / "dashboard" / "public" / "data"

COLS = [
    "business_id", "name", "city", "state",
    "avg_stars", "review_count_actual",
    "price_range", "cuisine_type", "avg_sentiment", "hidden_gem_score",
]

BASE_SELECT = """
    SELECT
        business_id, name, city, state,
        avg_stars, review_count_actual,
        price_range, cuisine_type, avg_sentiment, hidden_gem_score
    FROM mart_restaurants
"""


def fetch_grouped(con: duckdb.DuckDBPyConnection, query: str) -> dict:
    rows = con.execute(query).fetchall()
    grouped = {}
    for row in rows:
        r = dict(zip(COLS, row))
        cuisine = r.pop("cuisine_type")
        grouped.setdefault(cuisine, []).append(r)
    return grouped


def write_json(data: dict, path: Path) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def export() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect(str(DB_PATH))

    all_restaurants = fetch_grouped(con, f"{BASE_SELECT} ORDER BY cuisine_type, avg_stars DESC")
    hidden_gems     = fetch_grouped(con, f"{BASE_SELECT} WHERE hidden_gem_score IS NOT NULL ORDER BY cuisine_type, hidden_gem_score DESC")

    write_json(all_restaurants, OUT_DIR / "restaurants.json")
    write_json(hidden_gems,     OUT_DIR / "hidden_gems.json")
    con.close()

    total_all  = sum(len(v) for v in all_restaurants.values())
    total_gems = sum(len(v) for v in hidden_gems.values())
    print(f"restaurants.json: {total_all} restaurants across {len(all_restaurants)} cuisines")
    print(f"hidden_gems.json: {total_gems} hidden gems across {len(hidden_gems)} cuisines")
    for cuisine, items in sorted(hidden_gems.items(), key=lambda x: -len(x[1])):
        print(f"  {cuisine}: {len(items)}")


if __name__ == "__main__":
    export()
