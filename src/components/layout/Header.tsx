'use client';

import { SearchBar } from '@/components/search/SearchBar';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-2xl">🌤️</span>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">WeatherAQI</h1>
            <p className="text-white/40 text-xs">Live Forecast & Air Quality</p>
          </div>
        </div>

        {/* Search */}
        <SearchBar />

        {/* Right side */}
        <div className="flex-shrink-0 text-right hidden sm:block">
          <p className="text-white/30 text-xs">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', month: 'short', day: 'numeric',
            })}
          </p>
          <p className="text-white/20 text-xs mt-0.5">Updates every 10 min</p>
        </div>
      </div>
    </header>
  );
}
