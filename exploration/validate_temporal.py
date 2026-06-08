import duckdb
con = duckdb.connect(r'C:\Users\matig\data_analytics\yelp_analytics_project\data\yelp.duckdb')

print('=== COLUMNAS DISPONIBLES EN STG_BUSINESS ===')
print(con.execute("DESCRIBE stg_business").df().to_string(index=False))

print()
print('=== COLUMNAS DISPONIBLES EN STG_REVIEW ===')
print(con.execute("DESCRIBE stg_review").df().to_string(index=False))
