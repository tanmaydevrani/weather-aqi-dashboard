'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { fetchWeatherThunk } from '@/store/slices/weatherSlice';
import { fetchAqi } from '@/lib/aqiApi';
import { pinCity, unpinCity } from '@/store/slices/citiesSlice';
import type { AqiData } from '@/types/aqi.d';
import { WeatherHero } from '@/components/weather/WeatherHero';
import { ForecastStrip } from '@/components/weather/ForecastStrip';
import { HourlyChart } from '@/components/weather/HourlyChart';
import { StatRow } from '@/components/weather/StatRow';
import { AqiGauge } from '@/components/aqi/AqiGauge';
import { PollutantGrid } from '@/components/aqi/PollutantGrid';
import { WeatherHeroSkeleton, AqiSkeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const AUTO_REFRESH_MS = 10 * 60 * 1000;

function parseSlug(slug: string): { name: string; lat: number; lng: number } | null {
  const parts = slug.split('-');
  if (parts.length < 3) return null;
  const lng = parseFloat(parts.pop()!);
  const lat = parseFloat(parts.pop()!);
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  if (isNaN(lat) || isNaN(lng)) return null;
  return { name, lat, lng };
}

export default function CityPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const slug = typeof params.slug === 'string' ? params.slug : '';
  const parsed = parseSlug(slug);

  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [aqiLoading, setAqiLoading] = useState(true);
  const [aqiError, setAqiError] = useState<string | null>(null);

  const pinnedCities = useSelector((s: RootState) => s.cities.pinned);
  const isPinned = parsed ? pinnedCities.some((c) => c.lat === parsed.lat && c.lng === parsed.lng) : false;

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
  }, [parsed, dispatch]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  if (!parsed) {
    return (
      <div className="text-center py-24">
        <p className="text-white/50">Invalid city URL.</p>
        <Link href="/" className="text-blue-400 hover:underline mt-4 block">← Go Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + Pin */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
        >
          ← Back to Dashboard
        </Link>
        <button
          onClick={() => {
            if (isPinned) {
              const city = pinnedCities.find((c) => c.lat === parsed.lat && c.lng === parsed.lng);
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
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            isPinned
              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-red-500/20 hover:text-red-400'
              : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
          }`}
        >
          {isPinned ? '★ Pinned' : '☆ Pin City'}
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

      {/* AQI Section */}
      <ErrorBoundary>
        {aqiLoading && !aqiData ? (
          <AqiSkeleton />
        ) : aqiData ? (
          <div className="space-y-4">
            <AqiGauge data={aqiData} />
            <PollutantGrid data={aqiData} />
          </div>
        ) : aqiError ? (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5">
            <p className="text-red-400 text-sm">Could not load AQI data: {aqiError}</p>
          </div>
        ) : null}
      </ErrorBoundary>

      {/* Forecast + Charts */}
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

      {/* Refresh indicator */}
      <p className="text-center text-white/20 text-xs">Auto-refreshes every 10 minutes</p>
    </div>
  );
}
