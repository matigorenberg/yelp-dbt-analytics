import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ResultsPage from './components/ResultsPage'

function parseHash() {
  const hash = window.location.hash.slice(1)
  if (!hash) return { view: 'home', cuisine: null, gemMode: false }
  const parts = hash.split('/')
  return {
    view: 'results',
    cuisine: decodeURIComponent(parts[0]),
    gemMode: parts[1] === 'gems',
  }
}

export default function App() {
  const initial = parseHash()
  const [view, setView] = useState(initial.view)
  const [selectedCuisine, setSelectedCuisine] = useState(initial.cuisine)
  const [isGemMode, setIsGemMode] = useState(initial.gemMode)
  const [allData, setAllData] = useState({ restaurants: null, gems: null })

  useEffect(() => {
    Promise.all([
      fetch('/data/restaurants.json').then(r => r.json()),
      fetch('/data/hidden_gems.json').then(r => r.json()),
    ]).then(([restaurants, gems]) => {
      setAllData({ restaurants, gems })
    })
  }, [])

  // Browser back/forward button support
  useEffect(() => {
    function handlePop() {
      const { view, cuisine, gemMode } = parseHash()
      setView(view)
      setSelectedCuisine(cuisine)
      setIsGemMode(gemMode)
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  function handleCuisineSelect(cuisine, gemMode) {
    setSelectedCuisine(cuisine)
    setIsGemMode(gemMode)
    setView('results')
    const hash = `#${encodeURIComponent(cuisine)}${gemMode ? '/gems' : ''}`
    window.history.pushState(null, '', hash)
  }

  function handleLogoClick() {
    setView('home')
    setSelectedCuisine(null)
    setIsGemMode(false)
    window.history.pushState(null, '', '#')
  }

  const results = selectedCuisine
    ? (isGemMode ? allData.gems : allData.restaurants)?.[selectedCuisine] ?? []
    : []

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar onCuisineSelect={handleCuisineSelect} onLogoClick={handleLogoClick} />
      {view === 'home' ? (
        <HeroSection onCuisineSelect={handleCuisineSelect} />
      ) : (
        <ResultsPage
          cuisine={selectedCuisine}
          isGemMode={isGemMode}
          results={results}
          loading={!allData.restaurants}
          onCuisineSelect={handleCuisineSelect}
          onBack={handleLogoClick}
        />
      )}
    </div>
  )
}
