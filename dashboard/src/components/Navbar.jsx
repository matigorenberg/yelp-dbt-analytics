import { useState, useRef, useEffect } from 'react'
import GemIcon from './GemIcon'

const CUISINES = [
  'American', 'Italian', 'Mexican', 'Chinese', 'Japanese',
  'Pizza', 'Burgers', 'Sushi', 'Indian', 'Thai',
  'Mediterranean', 'Seafood', 'BBQ', 'Vegan/Vegetarian',
  'Breakfast/Brunch', 'French', 'Other',
]

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  )
}

export default function Navbar({ onCuisineSelect, onLogoClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-14">
        <button onClick={onLogoClick} className="flex-shrink-0">
          <span className="text-yelp-red font-black text-3xl italic tracking-tight">yelp</span>
        </button>

        {/* Search inputs */}
        <div className="flex flex-1 max-w-2xl border border-gray-300 rounded overflow-hidden">
          <input
            type="text"
            placeholder="Burritos, gyms, hair salons..."
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
          />
          <div className="w-px bg-gray-300" />
          <input
            type="text"
            placeholder="Seattle, WA"
            defaultValue="United States"
            className="w-36 px-3 py-2 text-sm focus:outline-none"
          />
          <button className="bg-yelp-red hover:bg-yelp-dark text-white px-4 flex items-center">
            <SearchIcon />
          </button>
        </div>

        {/* Right nav links */}
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 flex-shrink-0">
          <a href="#" className="hover:underline whitespace-nowrap">Yelp for Business</a>
          <a href="#" className="hover:underline whitespace-nowrap">Write a Review</a>
          <a href="#" className="hover:underline">Log In</a>
          <button className="bg-yelp-red hover:bg-yelp-dark text-white px-3 py-1 rounded text-sm">
            Register
          </button>
        </div>
      </div>

      {/* Secondary row */}
      <div className="max-w-7xl mx-auto px-4 flex items-center h-10 gap-6 text-sm text-gray-600">
        {/* Restaurants with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-1 hover:text-yelp-red font-medium h-10"
            onMouseEnter={() => setDropdownOpen(true)}
            onClick={() => setDropdownOpen(v => !v)}
          >
            Restaurants <span className="text-xs">▾</span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute top-full left-0 mt-0 bg-white border border-gray-200 shadow-xl rounded-b-lg p-4 w-[380px]"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-semibold">
                Browse by cuisine
              </p>
              <div className="grid grid-cols-2 gap-0.5">
                {CUISINES.map(cuisine => (
                  <div
                    key={cuisine}
                    className="flex items-center justify-between hover:bg-gray-50 rounded px-2 py-1.5 group"
                  >
                    <button
                      className="text-sm text-gray-700 group-hover:text-yelp-red text-left min-w-0 truncate"
                      onClick={() => { onCuisineSelect(cuisine, false); setDropdownOpen(false) }}
                    >
                      {cuisine}
                    </button>
                    <button
                      title={`Hidden Gems: ${cuisine}`}
                      onClick={() => { onCuisineSelect(cuisine, true); setDropdownOpen(false) }}
                      className="flex-shrink-0 text-gray-300 opacity-60 group-hover:opacity-100 group-hover:text-yelp-red hover:scale-110 transition-all ml-2"
                    >
                      <GemIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
                Click the gem icon to filter by Hidden Gems
              </p>
            </div>
          )}
        </div>

        {/* Static nav items (decorative) */}
        {['Home and Garden', 'Car services', 'Health & Beauty', 'Travel & Activities', 'More'].map(label => (
          <span key={label} className="hidden lg:flex items-center gap-1 cursor-default text-gray-400 whitespace-nowrap">
            {label} <span className="text-xs">▾</span>
          </span>
        ))}
      </div>
    </nav>
  )
}
