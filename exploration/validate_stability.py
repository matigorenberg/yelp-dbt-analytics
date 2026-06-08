import duckdb
con = duckdb.connect(r'C:\Users\matig\data_analytics\yelp_analytics_project\data\yelp.duckdb')

print('=== ESTABILIDAD DE SENTIMIENTO POR BUCKET DE REVIEWS ===')
print(con.execute('''
    WITH buckets AS (
        SELECT
            CASE
                WHEN review_count_actual < 10  THEN '01_under_10'
                WHEN review_count_actual < 20  THEN '02_10-19'
                WHEN review_count_actual < 30  THEN '03_20-29'
                WHEN review_count_actual < 50  THEN '04_30-49'
                WHEN review_count_actual < 75  THEN '05_50-74'
                WHEN review_count_actual < 100 THEN '06_75-99'
                WHEN review_count_actual < 200 THEN '07_100-199'
                ELSE                                '08_200+'
            END as bucket,
            avg_sentiment
        FROM mart_restaurants
        WHERE avg_sentiment IS NOT NULL
    )
    SELECT
        bucket,
        count(*)                                                        as businesses,
        round(avg(avg_sentiment), 4)                                    as avg_sentiment,
        round(stddev(avg_sentiment), 4)                                 as stddev_sentiment
    FROM buckets
    GROUP BY bucket
    ORDER BY bucket
''').df().to_string(index=False))
