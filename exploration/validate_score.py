import duckdb
con = duckdb.connect(r'C:\Users\matig\data_analytics\yelp_analytics_project\data\yelp.duckdb')

print('=== TOP 10 HIDDEN GEMS (nueva formula) ===')
print(con.execute('''
    SELECT name, city, avg_stars, avg_sentiment, review_count_actual, hidden_gem_score
    FROM mart_restaurants
    WHERE hidden_gem_score IS NOT NULL
    ORDER BY hidden_gem_score DESC
    LIMIT 10
''').df().to_string(index=False))

print()
print('=== DISTRIBUCION DEL SCORE ===')
print(con.execute('''
    SELECT
        round(min(hidden_gem_score), 4) as min,
        round(percentile_cont(0.25) WITHIN GROUP (ORDER BY hidden_gem_score), 4) as p25,
        round(percentile_cont(0.5) WITHIN GROUP (ORDER BY hidden_gem_score), 4) as median,
        round(percentile_cont(0.75) WITHIN GROUP (ORDER BY hidden_gem_score), 4) as p75,
        round(max(hidden_gem_score), 4) as max,
        count(*) as total_with_score
    FROM mart_restaurants
    WHERE hidden_gem_score IS NOT NULL
''').df().to_string(index=False))
