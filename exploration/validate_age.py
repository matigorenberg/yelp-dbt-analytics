import duckdb
con = duckdb.connect(r'C:\Users\matig\data_analytics\yelp_analytics_project\data\yelp.duckdb')

print('=== ANTIGUEDAD DE NEGOCIOS (por primera review) ===')
print(con.execute('''
    WITH first_review AS (
        SELECT
            business_id,
            min(review_date) as first_review_date,
            max(review_date) as last_review_date
        FROM stg_review
        GROUP BY business_id
    )
    SELECT
        CASE
            WHEN date_diff('year', first_review_date, DATE '2022-12-31') < 1  THEN '< 1 year'
            WHEN date_diff('year', first_review_date, DATE '2022-12-31') < 2  THEN '1-2 years'
            WHEN date_diff('year', first_review_date, DATE '2022-12-31') < 3  THEN '2-3 years'
            WHEN date_diff('year', first_review_date, DATE '2022-12-31') < 5  THEN '3-5 years'
            ELSE '5+ years'
        END as age_bucket,
        count(*) as businesses,
        round(avg(date_diff('year', first_review_date, DATE '2022-12-31')), 1) as avg_years
    FROM first_review
    GROUP BY age_bucket
    ORDER BY avg_years
''').df().to_string(index=False))
