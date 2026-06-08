import GemIcon from './GemIcon'

const FEATURED = ['American', 'Italian', 'Mexican', 'Japanese', 'Pizza', 'Sushi']

const BROWSE_CUISINES = [
  'American', 'Italian', 'Mexican', 'Chinese',
  'Japanese', 'Pizza', 'Burgers', 'Seafood',
]

export default function HeroSection({ onCuisineSelect }) {
  return (
    <>
      <div
        className="h-64 flex flex-col items-center justify-center text-white text-center"
        style={{ background: 'linear-gradient(135deg, #c41200 0%, #8b0000 100%)' }}
      >
        <h1 className="text-4xl font-bold mb-2">Discover local businesses</h1>
        <p className="text-base opacity-75 mb-6">Find the hidden gems in your city</p>
        <div className="flex flex-wrap justify-center gap-2">
          {FEATURED.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => onCuisineSelect(cuisine, false)}
              className="bg-white bg-opacity-15 hover:bg-opacity-25 text-white text-sm px-4 py-1.5 rounded-full border border-white border-opacity-30 transition-all"
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-800">Hidden Gems by cuisine</h2>
          <GemIcon className="w-4 h-4 text-yelp-red" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BROWSE_CUISINES.map(cuisine => (
            <button
              key={cuisine}
              onClick={() => onCuisineSelect(cuisine, true)}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-yelp-red hover:shadow-sm transition-all text-sm font-medium text-gray-700 group"
            >
              <span>{cuisine}</span>
              <GemIcon className="w-3 h-3 text-gray-300 group-hover:text-yelp-red transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
