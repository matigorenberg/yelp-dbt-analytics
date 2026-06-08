-- Aggregates per-review VADER scores to business level.
-- Source table review_sentiment is populated by ingestion/run_vader.py.
with sentiment as (
    select * from review_sentiment
)

select
    business_id,
    count(*)                                                                        as scored_review_count,
    round(avg(vader_compound), 4)                                                   as avg_sentiment,
    round(
        100.0 * sum(case when vader_compound >  0.05 then 1 else 0 end) / count(*),
        1
    )                                                                               as pct_positive,
    round(
        100.0 * sum(case when vader_compound < -0.05 then 1 else 0 end) / count(*),
        1
    )                                                                               as pct_negative,
    round(
        100.0 * sum(case when vader_compound between -0.05 and 0.05 then 1 else 0 end) / count(*),
        1
    )                                                                               as pct_neutral

from sentiment
group by business_id
