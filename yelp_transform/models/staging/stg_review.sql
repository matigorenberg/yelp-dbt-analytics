with source as (
    select * from raw_review
),

cleaned as (
    select
        review_id,
        user_id,
        business_id,
        stars,
        -- useful/funny/cool signal peer-validated review quality; used as weight in downstream analysis
        useful,
        funny,
        cool,
        useful + funny + cool                               as total_votes,
        text                                                as review_text,
        date::date                                          as review_date,
        date_part('year', date)                             as review_year

    from source

    -- text-less reviews carry no signal for sentiment analysis
    where text is not null
      and trim(text) != ''
)

select * from cleaned
