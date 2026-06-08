with source as (
    select * from raw_business
),

restaurants as (
    select
        business_id,
        name,
        city,
        state,
        postal_code,
        latitude,
        longitude,
        stars                                               as avg_stars,
        review_count,
        is_open::boolean                                    as is_open,
        categories,

        -- attributes is a STRUCT with all Yelp fields; most are null for restaurants
        attributes.RestaurantsPriceRange2                   as price_range,
        attributes.OutdoorSeating                           as outdoor_seating,
        attributes.RestaurantsDelivery                      as has_delivery,
        attributes.RestaurantsTakeOut                       as has_takeout,
        attributes.RestaurantsReservations                  as takes_reservations,
        attributes.WiFi                                     as wifi,
        attributes.Alcohol                                  as alcohol,
        attributes.GoodForKids                              as good_for_kids,
        attributes.HasTV                                    as has_tv

    from source

    where categories ilike '%restaurants%'
)

select * from restaurants
