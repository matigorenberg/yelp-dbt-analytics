import GemIcon from './GemIcon'

function Stars({ value }) {
  const full = Math.round(value)
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-base leading-none ${i <= full ? 'text-yelp-red' : 'text-gray-200'}`}>★</span>
      ))}
      <span className="text-sm text-gray-500 ml-1">{value}</span>
    </span>
  )
}

function PlaceholderThumb() {
  return (
    <div className="w-28 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-300">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a4 4 0 0 1 4 4c0 2.21-1.79 4-4 4S8 8.21 8 6a4 4 0 0 1 4-4zM4 20c0-4 3.58-7 8-7s8 3 8 7" />
      </svg>
    </div>
  )
}

export default function RestaurantCard({ restaurant: r, rank, isGemMode }) {
  const sentimentPct = r.avg_sentiment != null ? Math.round(r.avg_sentiment * 100) : null

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
      {/* Rank */}
      <div className="text-lg font-bold text-gray-300 w-6 text-center flex-shrink-0 pt-1">{rank}.</div>

      {/* Thumbnail placeholder */}
      <PlaceholderThumb />

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-base text-gray-900 hover:text-yelp-red cursor-pointer">
            {r.name}
          </h3>
          {isGemMode && (
            <span className="text-xs bg-red-50 text-yelp-red border border-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <GemIcon className="w-2.5 h-2.5" />
              Hidden Gem
            </span>
          )}
        </div>

        <Stars value={r.avg_stars} />

        <div className="text-sm text-gray-500 mt-1">
          {r.review_count_actual?.toLocaleString()} reviews
          {r.price_range && ` · ${r.price_range}`}
          {` · ${r.city}, ${r.state}`}
        </div>

        {isGemMode && sentimentPct !== null && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 max-w-32 bg-gray-100 rounded-full h-1">
              <div
                className="bg-green-400 h-1 rounded-full"
                style={{ width: `${Math.min(sentimentPct, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{sentimentPct}% positive</span>
          </div>
        )}
      </div>
    </div>
  )
}
