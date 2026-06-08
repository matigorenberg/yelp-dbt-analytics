import { useMemo } from 'react'

const STAR_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '3+ stars', value: 3 },
  { label: '3.5+ stars', value: 3.5 },
  { label: '4+ stars', value: 4 },
  { label: '4.5+ stars', value: 4.5 },
]

const REVIEW_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '20+', value: 20 },
  { label: '50+', value: 50 },
  { label: '100+', value: 100 },
  { label: '500+', value: 500 },
]

export default function FiltersSidebar({ results, filters, onChange }) {
  const availablePrices = useMemo(() => {
    const seen = new Set(results.map(r => r.price_range).filter(Boolean))
    return [...seen].sort()
  }, [results])

  const activeCount =
    (filters.minStars > 0 ? 1 : 0) +
    (filters.minReviews > 0 ? 1 : 0) +
    filters.prices.length

  function togglePrice(price) {
    onChange(prev => ({
      ...prev,
      prices: prev.prices.includes(price)
        ? prev.prices.filter(p => p !== price)
        : [...prev.prices, price],
    }))
  }

  return (
    <aside className="w-48 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-gray-800 text-sm">Filters</h2>
        {activeCount > 0 && (
          <button
            className="text-xs text-yelp-red hover:underline"
            onClick={() => onChange({ minStars: 0, minReviews: 0, prices: [] })}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Min star rating */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Min rating</h3>
        <div className="space-y-0.5">
          {STAR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange(prev => ({ ...prev, minStars: opt.value }))}
              className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                filters.minStars === opt.value
                  ? 'bg-red-50 text-yelp-red font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Min review count */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Min reviews</h3>
        <div className="space-y-0.5">
          {REVIEW_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange(prev => ({ ...prev, minReviews: opt.value }))}
              className={`w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                filters.minReviews === opt.value
                  ? 'bg-red-50 text-yelp-red font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      {availablePrices.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Price</h3>
          <div className="flex flex-wrap gap-1.5">
            {availablePrices.map(price => (
              <button
                key={price}
                onClick={() => togglePrice(price)}
                className={`text-sm px-2.5 py-1 border rounded transition-colors ${
                  filters.prices.includes(price)
                    ? 'bg-yelp-red text-white border-yelp-red'
                    : 'text-gray-600 border-gray-300 hover:border-yelp-red hover:text-yelp-red'
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
