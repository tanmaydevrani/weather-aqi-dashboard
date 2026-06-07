'use client';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { useGeolocation } from '@/hooks/useGeolocation';
import { fetchWeatherThunk } from '@/store/slices/weatherSlice';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastStrip } from '@/components/weather/ForecastStrip';
import { HourlyChart } from '@/components/weather/HourlyChart';
import { StatRow } from '@/components/weather/StatRow';
import { CityCard } from '@/components/search/CityCard';
import { WeatherHeroSkeleton, ForecastSkeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const AUTO_REFRESH_MS = 10 * 60 * 1000;

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { coords, permissionStatus, cityName, requestLocation } = useGeolocation();
  const pinnedCities = useSelector((s: RootState) => s.cities.pinned);

  const locationKey = coords ? `${coords.lat},${coords.lng}` : null;
  const weatherData = useSelector((s: RootState) =>
    locationKey ? s.weather.cache[locationKey] : null
  );
  const weatherLoading = useSelector((s: RootState) =>
    locationKey ? s.weather.loading[locationKey] : false
  );

  const fetchData = useCallback(async () => {
    if (!coords) return;
    dispatch(fetchWeatherThunk({ lat: coords.lat, lng: coords.lng }));
  }, [coords, dispatch]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  const hasLocation = !!coords;
  const permissionPending = permissionStatus === 'idle' || permissionStatus === 'requesting';
  const permissionDenied = permissionStatus === 'denied' || permissionStatus === 'unavailable';

  return (
    <div className="space-y-8">
      {/* Location permission banner */}
      {permissionPending && (
        <div
          className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: 'rgba(0,122,255,0.08)',
            border: '1px solid rgba(0,122,255,0.18)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">📍</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                Enable location for local weather
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
                Or search for any city using the bar above
              </p>
            </div>
          </div>
          <button
            onClick={requestLocation}
            disabled={permissionStatus === 'requesting'}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex-shrink-0 active:scale-95"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            {permissionStatus === 'requesting' ? 'Locating…' : 'Use My Location'}
          </button>
        </div>
      )}

      {permissionDenied && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{
            background: 'rgba(234,179,8,0.08)',
            border: '1px solid rgba(234,179,8,0.18)',
          }}
        >
          <span className="text-lg flex-shrink-0">⚠️</span>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            Location access denied. Search for any city using the bar above, or enable location in browser settings.
          </p>
        </div>
      )}

      {/* Current location weather */}
      {hasLocation && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
              Your Location
            </span>
            {cityName && (
              <span className="text-xs" style={{ color: 'var(--text-4)' }}>{cityName}</span>
            )}
          </div>

          <ErrorBoundary>
            {weatherLoading && !weatherData ? (
              <WeatherHeroSkeleton />
            ) : weatherData ? (
              <WeatherHero data={weatherData} cityName={cityName ?? 'Your Location'} />
            ) : null}
          </ErrorBoundary>

          {weatherData && (
            <ErrorBoundary>
              <ForecastStrip data={weatherData} />
            </ErrorBoundary>
          )}

          {weatherData && (
            <ErrorBoundary>
              <HourlyChart data={weatherData} />
            </ErrorBoundary>
          )}

          {weatherData && (
            <ErrorBoundary>
              <StatRow data={weatherData} />
            </ErrorBoundary>
          )}
        </section>
      )}

      {/* Pinned / default cities */}
      {pinnedCities.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
              Cities
            </span>
            <span className="text-xs" style={{ color: 'var(--text-4)' }}>
              Tap a card to see details
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {pinnedCities.map((city) => (
              <ErrorBoundary key={city.id}>
                <CityCard city={city} />
              </ErrorBoundary>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasLocation && pinnedCities.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <span className="text-6xl block">🌍</span>
          <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>No cities yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            Search for a city above or enable location access
          </p>
        </div>
      )}
    </div>
  );
}
