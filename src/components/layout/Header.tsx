'use client';

import { useTheme } from '@/components/layout/ThemeProvider';
import { SearchBar } from '@/components/search/SearchBar';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        background: theme === 'dark'
          ? 'rgba(5, 5, 8, 0.75)'
          : 'rgba(242, 242, 247, 0.80)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0 transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            🌤️
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-base leading-none" style={{ color: 'var(--text)' }}>
              WeatherAQI
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
              Live Forecast & Air Quality
            </p>
          </div>
        </a>

        {/* Search — grows to fill remaining space */}
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Date — hidden on small screens */}
          <div className="hidden md:block text-right">
            <p className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-2)',
            }}
          >
            {theme === 'dark' ? (
              // Sun icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              // Moon icon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
