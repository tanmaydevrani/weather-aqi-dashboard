'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { setQuery, setIsOpen, clearSearch, searchCitiesThunk } from '@/store/slices/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { buildCitySlug } from '@/lib/citySlug';

export function SearchBar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { query, results, loading, isOpen } = useSelector((s: RootState) => s.search);
  const debouncedQuery = useDebounce(query, 400);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(searchCitiesThunk(debouncedQuery));
    } else {
      dispatch(setIsOpen(false));
    }
  }, [debouncedQuery, dispatch]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch(setIsOpen(false));
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dispatch]);

  function handleCitySelect(result: typeof results[0]) {
    const slug = buildCitySlug(result.name, result.lat, result.lng);
    dispatch(clearSearch());
    router.push(`/city/${slug}`);
  }

  const showDropdown = isOpen && query.length >= 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all"
        style={{
          background: focused ? 'var(--surface-hover)' : 'var(--surface)',
          border: `1px solid ${focused ? 'var(--border-strong)' : 'var(--border)'}`,
          boxShadow: focused ? 'var(--shadow)' : 'none',
        }}
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          style={{ color: 'var(--text-3)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm outline-none min-w-0"
          style={{ color: 'var(--text)' }}
        />
        {loading && (
          <div
            className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
            style={{ borderColor: 'var(--border-strong)', borderTopColor: 'transparent' }}
          />
        )}
        {query && !loading && (
          <button
            onClick={() => dispatch(clearSearch())}
            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors"
            style={{ background: 'var(--border-strong)', color: 'var(--text-3)' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl overflow-hidden"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {results.slice(0, 6).map((result, i) => (
            <button
              key={result.id}
              className="w-full px-4 py-3 text-left transition-colors flex items-center gap-3"
              style={{
                borderBottom: i < Math.min(results.length, 6) - 1 ? `1px solid var(--border)` : 'none',
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCitySelect(result)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <span className="text-base flex-shrink-0" style={{ color: 'var(--text-3)' }}>📍</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                  {result.name}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {result.displayName}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && results.length === 0 && !loading && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl p-4 text-center"
          style={{
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            No results for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
