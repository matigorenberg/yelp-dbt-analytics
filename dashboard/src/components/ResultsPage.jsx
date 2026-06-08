import { useState, useEffect, useRef } from 'react'
import RestaurantCard from './RestaurantCard'
import GemIcon from './GemIcon'
import FiltersSidebar from './FiltersSidebar'
import InfoTooltip from './InfoTooltip'

const PAGE_SIZE = 20
const DEFAULT_FILTERS = { minStars: 0, minReviews: 0, prices: [] }

export default function ResultsPage({ cuisine, isGemMode, results, loading, onCuisineSelect, onBack }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef(null)

  // Changing cuisine/mode resets filters, which in turn triggers the visibleCount reset below
  useEffect(() => {
    setFilters(DEFAULT_FILTERS)
  }, [cuisine, isGemMode])

  // Reset scroll when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters])

  // Apply filters client-side
  const filtered = results.filter(r => {
    if (filters.minStars > 0 && r.avg_stars < filters.minStars) return false
    if (filters.minReviews > 0 && r.review_count_actual < filters.minReviews) return false
    if (filters.prices.length > 0 && !filters.prices.includes(r.price_range)) return false
    return true
  })

  const shown = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // Infinite scroll: load more when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount(c => c + PAGE_SIZE)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, visibleCount])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-lg">Loading...</div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-yelp-red mb-5 transition-colors"
      >
        ← Home
      </button>

      <div className="flex gap-8 items-start">
        {/* Filters sidebar */}
        <FiltersSidebar results={results} filters={filters} onChange={setFilters} />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isGemMode && <GemIcon className="w-5 h-5 text-yelp-red flex-shrink-0" />}
            <h1 className="text-2xl font-bold text-gray-900">
              {isGemMode ? 'Hidden Gems:' : 'Best'} {cuisine} Restaurants
            </h1>
            {isGemMode && (
              <>
                <span className="bg-red-50 border border-red-100 text-yelp-red text-xs px-3 py-1 rounded-full">
                  High sentiment · Under the radar
                </span>
                <InfoTooltip
                  text="The best places nobody knows about yet. We scored restaurants by how positively people write about them compared to how many reviews they have, so the most praised spots rise to the top before the crowds arrive."
                  position="right"
                />
              </>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {filtered.length.toLocaleString()} results
            {filtered.length !== results.length && ` (filtered from ${results.length.toLocaleString()})`}
            {isGemMode ? ' · ranked by sentiment score' : ''}
          </p>

          {/* All / Hidden Gems toggle */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-2">
              <button
                onClick={() => onCuisineSelect(cuisine, false)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                  !isGemMode
                    ? 'bg-yelp-red text-white border-yelp-red'
                    : 'text-gray-600 border-gray-300 hover:border-yelp-red hover:text-yelp-red'
                }`}
              >
                All restaurants
              </button>
              <button
                onClick={() => onCuisineSelect(cuisine, true)}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                  isGemMode
                    ? 'bg-yelp-red text-white border-yelp-red'
                    : 'text-gray-600 border-gray-300 hover:border-yelp-red hover:text-yelp-red'
                }`}
              >
                <GemIcon className="w-3 h-3" />
                Hidden Gems only
              </button>
            </div>
            <InfoTooltip
              text="The best places nobody knows about yet. We scored restaurants by how positively people write about them compared to how many reviews they have, so the most praised spots rise to the top before the crowds arrive."
              position="right"
            />
          </div>

          {/* Results list */}
          {shown.length === 0 ? (
            <div className="text-gray-400 py-16 text-center">No results match the current filters.</div>
          ) : (
            <>
              <div className="space-y-3">
                {shown.map((r, i) => (
                  <RestaurantCard
                    key={r.business_id}
                    restaurant={r}
                    rank={i + 1}
                    isGemMode={isGemMode}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {hasMore && <div ref={sentinelRef} className="h-10" />}

              {!hasMore && shown.length > 0 && (
                <p className="text-center text-sm text-gray-400 py-8 border-t border-gray-100 mt-4">
                  All {filtered.length.toLocaleString()} results shown
                </p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
