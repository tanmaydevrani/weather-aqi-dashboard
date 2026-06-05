'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { setQuery, setIsOpen, clearSearch, searchCitiesThunk } from '@/store/slices/searchSlice';
import { pinCity } from '@/store/slices/citiesSlice';
import { useDebounce } from '@/hooks/useDebounce';

export function SearchBar() {
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
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch(setIsOpen(false));
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dispatch]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
        focused
          ? 'bg-white/10 border-white/30 shadow-lg shadow-white/5'
          : 'bg-white/5 border-white/10'
      }`}>
        <svg className="w-4 h-4 text-white/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        )}
        {query && !loading && (
          <button
            onClick={() => dispatch(clearSearch())}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-gray-900 border border-white/10 shadow-2xl overflow-hidden">
          {results.slice(0, 6).map((result) => (
            <button
              key={result.id}
              className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              onClick={() => {
                dispatch(pinCity({
                  id: result.id,
                  name: result.name,
                  country: result.country,
                  state: result.state,
                  lat: result.lat,
                  lng: result.lng,
                }));
                dispatch(clearSearch());
              }}
            >
              <p className="text-white font-medium text-sm">{result.name}</p>
              <p className="text-white/40 text-xs mt-0.5 truncate">{result.displayName}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-gray-900 border border-white/10 p-4 text-center">
          <p className="text-white/40 text-sm">No cities found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
