'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchWeatherThunk } from '@/store/slices/weatherSlice';
import { fetchAqi } from '@/lib/aqiApi';
import { pinCity, unpinCity } from '@/store/slices/citiesSlice';
import { parseCitySlug } from '@/lib/citySlug';
import type { AqiData } from '@/types/aqi.d';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastStrip } from '@/components/weather/ForecastStrip';
import { HourlyChart } from '@/components/weather/HourlyChart';
import { StatRow } from '@/components/weather/StatRow';
import { AqiGauge } from '@/components/aqi/AqiGauge';
import { PollutantGrid } from '@/components/aqi/PollutantGrid';
import { WeatherHeroSkeleton, AqiSkeleton, ForecastSkeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const AUTO_REFRESH_MS = 10 * 60 * 1000;

export default function CityPage() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const slug = typeof params.slug === 'string' ? params.slug : '';
  const parsed = parseCitySlug(slug);

  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [aqiError, setAqiError] = useState<string | null>(null);

  const pinnedCities = useSelector((s: RootState) => s.cities.pinned);
  const isPinned = parsed
    ? pinnedCities.some((c) => Math.abs(c.lat - parsed.lat) < 0.01 && Math.abs(c.lng - parsed.lng) < 0.01)
    : false;

  const key = parsed ? `${parsed.lat},${parsed.lng}` : '';
  const weatherData = useSelector((s: RootState) => (key ? s.weather.cache[key] : null));
  const weatherLoading = useSelector((s: RootState) => (key ? s.weather.loading[key] : false));

  const fetchAll = useCallback(async () => {
    if (!parsed) return;
    dispatch(fetchWeatherThunk({ lat: parsed.lat, lng: parsed.lng }));

    setAqiLoading(true);
    setAqiError(null);
    try {
      const data = await fetchAqi(parsed.lat, parsed.lng);
      setAqiData(data);
    } catch (err: unknown) {
      setAqiError(err instanceof Error ? err.message : 'AQI fetch failed');
    } finally {
      setAqiLoading(false);
    }
  }, [parsed?.lat, parsed?.lng, dispatch]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  if (!parsed) {
    return (
      <div className="text-center py-24 space-y-4">
        <span className="text-5xl">🔍</span>
        <p className="font-semibold" style={{ color: 'var(--text)' }}>Invalid city URL</p>
        <Link href="/" className="text-sm underline" style={{ color: 'var(--accent)' }}>
          ← Go back home
        </Link>
      </div>
    );
  }

  function handlePinToggle() {
    if (!parsed) return;
    if (isPinned) {
      const city = pinnedCities.find(
        (c) => Math.abs(c.lat - parsed.lat) < 0.01 && Math.abs(c.lng - parsed.lng) < 0.01
      );
      if (city) dispatch(unpinCity(city.id));
    } else {
      dispatch(pinCity({
        id: slug,
        name: parsed.name,
        country: '',
        lat: parsed.lat,
        lng: parsed.lng,
      }));
    }
  }

  return (
    <div className="space-y-4">
      {/* Nav row */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-3)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </Link>

        <button
          onClick={handlePinToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
          style={isPinned
            ? { background: 'rgba(234,179,8,0.12)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.2)' }
            : { background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }
          }
        >
          {isPinned ? '★ Saved' : '☆ Save City'}
        </button>
      </div>

      {/* Weather Hero */}
      <ErrorBoundary>
        {weatherLoading && !weatherData ? (
          <WeatherHeroSkeleton />
        ) : weatherData ? (
          <WeatherHero data={weatherData} cityName={parsed.name} />
        ) : null}
      </ErrorBoundary>

      {/* Forecast */}
      {weatherData ? (
        <ErrorBoundary>
          <ForecastStrip data={weatherData} />
        </ErrorBoundary>
      ) : (
        <ForecastSkeleton />
      )}

      {/* Hourly chart */}
      {weatherData && (
        <ErrorBoundary>
          <HourlyChart data={weatherData} />
        </ErrorBoundary>
      )}

      {/* Stat row */}
      {weatherData && (
        <ErrorBoundary>
          <StatRow data={weatherData} />
        </ErrorBoundary>
      )}

      {/* AQI */}
      <ErrorBoundary>
        {aqiLoading && !aqiData ? (
          <AqiSkeleton />
        ) : aqiData ? (
          <>
            <AqiGauge data={aqiData} />
            <PollutantGrid data={aqiData} />
          </>
        ) : aqiError ? (
          <div
            className="rounded-2xl p-5"
            style={{ background: '#ef444410', border: '1px solid #ef444425' }}
          >
            <p className="text-sm text-red-400">Could not load AQI data: {aqiError}</p>
          </div>
        ) : null}
      </ErrorBoundary>

      <p className="text-center text-xs pb-2" style={{ color: 'var(--text-4)' }}>
        Auto-refreshes every 10 minutes
      </p>
    </div>
  );
}
