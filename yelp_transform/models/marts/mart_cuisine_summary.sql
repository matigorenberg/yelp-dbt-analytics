-- Per-cuisine aggregates for dashboard comparisons; excludes "Other" to keep charts readable
with base as (
    select * from {{ ref('mart_restaurants') }}
    where cuisine_type != 'Other'
      and review_count_actual is not null
)

select
    cuisine_type,
    count(*)                                    as restaurant_count,
    round(avg(avg_stars_reviews), 2)            as avg_rating,
    round(avg(review_count_actual), 0)          as avg_review_count,
    round(avg(hidden_gem_score), 4)             as avg_hidden_gem_score,
    sum(case when is_open then 1 else 0 end)    as open_count,
    -- pct of still-open venues per cuisine, a rough proxy for category health
    round(
        100.0 * sum(case when is_open then 1 else 0 end) / count(*),
        1
    )                                           as pct_open

from base
group by cuisine_type
order by restaurant_count desc
