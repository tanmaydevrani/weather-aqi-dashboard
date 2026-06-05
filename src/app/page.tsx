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
import { AqiGauge } from '@/components/aqi/AqiGauge';
import { PollutantGrid } from '@/components/aqi/PollutantGrid';
import { CityCard } from '@/components/search/CityCard';
import { WeatherHeroSkeleton, AqiSkeleton, ForecastSkeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const AUTO_REFRESH_MS = 10 * 60 * 1000; // 10 minutes

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { coords, permissionStatus, cityName, requestLocation } = useGeolocation();
  const pinnedCities = useSelector((s: RootState) => s.cities.pinned);

  // Determine active location key
  const locationKey = coords ? `${coords.lat},${coords.lng}` : null;
  const weatherData = useSelector((s: RootState) =>
    locationKey ? s.weather.cache[locationKey] : null
  );
  const weatherLoading = useSelector((s: RootState) =>
    locationKey ? s.weather.loading[locationKey] : false
  );

  // Fetch AQI separately (stored in component state for simplicity)
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

  return (
    <div className="space-y-8">
      {/* Location Banner */}
      {permissionStatus === 'idle' || permissionStatus === 'requesting' ? (
        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-white font-medium">Enable location for local weather</p>
              <p className="text-white/50 text-sm">Or browse pinned cities below</p>
            </div>
          </div>
          <button
            onClick={requestLocation}
            disabled={permissionStatus === 'requesting'}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
          >
            {permissionStatus === 'requesting' ? 'Locating...' : 'Use My Location'}
          </button>
        </div>
      ) : permissionStatus === 'denied' || permissionStatus === 'unavailable' ? (
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-white/70 text-sm">
            Location access denied. Showing pinned cities. Enable location in browser settings to see local weather.
          </p>
        </div>
      ) : null}

      {/* Main Weather (user location) */}
      {hasLocation && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider">
              📍 Your Location
            </h2>
            <span className="text-white/30 text-xs">{cityName}</span>
          </div>

          <ErrorBoundary>
            {weatherLoading && !weatherData ? (
              <WeatherHeroSkeleton />
            ) : weatherData ? (
              <WeatherHero
                data={weatherData}
                cityName={cityName ?? 'Your Location'}
              />
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

      {/* Pinned Cities Grid */}
      {pinnedCities.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-white/60 text-sm font-medium uppercase tracking-wider">
            🏙️ Cities ({pinnedCities.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
        <div className="text-center py-24 space-y-4">
          <span className="text-6xl block">🌍</span>
          <h3 className="text-white text-xl font-semibold">No cities yet</h3>
          <p className="text-white/40">Search for a city above or enable location access</p>
        </div>
      )}
    </div>
  );
}
