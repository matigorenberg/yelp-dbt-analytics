with source as (
    select * from raw_tip
),

cleaned as (
    select
        user_id,
        business_id,
        text                                                as tip_text,
        date::date                                          as tip_date,
        compliment_count

    from source

    -- empty tips carry no value for text analysis
    where text is not null
      and trim(text) != ''
)

select * from cleaned
