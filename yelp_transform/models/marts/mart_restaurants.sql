with businesses as (
    select * from {{ ref('stg_business') }}
),

sentiment as (
    select * from {{ ref('int_business_sentiment') }}
),

-- avg_stars in stg_business is Yelp's cumulative historical average; this recalculates it from raw review data
review_stats as (
    select
        business_id,
        count(*)                                    as review_count_actual,
        round(avg(stars), 2)                        as avg_stars_reviews,
        max(review_date)                            as last_review_date,
        sum(total_votes)                            as total_review_votes
    from {{ ref('stg_review') }}
    group by business_id
),

-- categories is a comma-separated string; pattern matching extracts the dominant cuisine type
cuisine_extract as (
    select
        business_id,
        case
            when categories ilike '%italian%'       then 'Italian'
            when categories ilike '%mexican%'       then 'Mexican'
            when categories ilike '%chinese%'       then 'Chinese'
            when categories ilike '%japanese%'      then 'Japanese'
            when categories ilike '%american%'      then 'American'
            when categories ilike '%pizza%'         then 'Pizza'
            when categories ilike '%burger%'        then 'Burgers'
            when categories ilike '%sushi%'         then 'Sushi'
            when categories ilike '%indian%'        then 'Indian'
            when categories ilike '%thai%'          then 'Thai'
            when categories ilike '%mediterranean%' then 'Mediterranean'
            when categories ilike '%french%'        then 'French'
            when categories ilike '%seafood%'       then 'Seafood'
            when categories ilike '%barbecue%'
              or categories ilike '%barbeque%'
              or categories ilike '% bbq%'          then 'BBQ'
            when categories ilike '%vegan%'
              or categories ilike '%vegetarian%'    then 'Vegan/Vegetarian'
            when categories ilike '%breakfast%'
              or categories ilike '%brunch%'        then 'Breakfast/Brunch'
            else 'Other'
        end as cuisine_type
    from businesses
),

joined as (
    select
        b.business_id,
        b.name,
        b.city,
        b.state,
        b.latitude,
        b.longitude,
        b.avg_stars,
        b.review_count,
        b.is_open,
        b.price_range,
        b.outdoor_seating,
        b.has_delivery,
        b.has_takeout,
        b.takes_reservations,
        b.wifi,
        b.alcohol,
        c.cuisine_type,
        r.review_count_actual,
        r.avg_stars_reviews,
        r.last_review_date,
        r.total_review_votes,

        -- minimum 20 reviews to filter out businesses where friends/family skew the rating
        -- uses sentiment instead of stars: text signal is less gameable and captures irony-free signal at scale
        case
            when r.review_count_actual >= 20 and s.avg_sentiment is not null
            then round(
                s.avg_sentiment / ln(r.review_count_actual + 2),
                4
            )
        end                                         as hidden_gem_score,

        s.avg_sentiment,
        s.pct_positive,
        s.pct_negative,
        s.pct_neutral,
        s.scored_review_count

    from businesses b
    left join review_stats r using (business_id)
    left join cuisine_extract c using (business_id)
    left join sentiment s using (business_id)
)

select * from joined
