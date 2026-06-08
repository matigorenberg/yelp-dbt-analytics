export default function InfoTooltip({ text, position = 'right' }) {
  const tooltipClass =
    position === 'right'
      ? 'left-full top-1/2 -translate-y-1/2 ml-2'
      : position === 'left'
      ? 'right-full top-1/2 -translate-y-1/2 mr-2'
      : position === 'top'
      ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      : 'top-full left-1/2 -translate-x-1/2 mt-2'

  const arrowClass =
    position === 'right'
      ? 'right-full top-1/2 -translate-y-1/2 border-r-gray-800'
      : position === 'left'
      ? 'left-full top-1/2 -translate-y-1/2 border-l-gray-800'
      : position === 'top'
      ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-800'
      : 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800'

  return (
    <span className="relative group inline-flex items-center">
      <button
        type="button"
        className="text-gray-400 hover:text-gray-500 transition-colors"
        aria-label="More information"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
      <div
        className={`absolute ${tooltipClass} w-60 bg-gray-800 text-white text-xs rounded-lg px-3 py-2.5 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 pointer-events-none shadow-lg`}
      >
        {text}
        <span className={`absolute ${arrowClass} border-4 border-transparent`} />
      </div>
    </span>
  )
}
