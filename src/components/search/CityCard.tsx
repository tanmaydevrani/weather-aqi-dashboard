'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import type { AppDispatch, RootState } from '@/store';
import { fetchWeatherThunk } from '@/store/slices/weatherSlice';
import { unpinCity } from '@/store/slices/citiesSlice';
import type { City } from '@/store/slices/citiesSlice';
import { weatherCodeToCondition } from '@/lib/weatherHelpers';
import { buildCitySlug } from '@/lib/citySlug';
import { Skeleton } from '@/components/ui/Skeleton';

const WEATHER_ICONS: Record<string, string> = {
  clear: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  foggy: '🌫️',
  drizzle: '🌦️',
  rain: '🌧️',
  snow: '❄️',
  thunderstorm: '⛈️',
  unknown: '🌡️',
};

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const key = `${city.lat},${city.lng}`;
  const weatherData = useSelector((s: RootState) => s.weather.cache[key]);
  const loading = useSelector((s: RootState) => s.weather.loading[key]);
  const error = useSelector((s: RootState) => s.weather.error[key]);

  useEffect(() => {
    dispatch(fetchWeatherThunk({ lat: city.lat, lng: city.lng }));
  }, [city.lat, city.lng, dispatch]);

  const slug = buildCitySlug(city.name, city.lat, city.lng);

  if (loading && !weatherData) {
    return (
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div
        className="rounded-xl p-4"
        style={{ background: '#ef444410', border: '1px solid #ef444430' }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{city.name}</p>
        <p className="text-xs mt-1 text-red-400">Failed to load</p>
      </div>
    );
  }

  const current = weatherData?.current;
  const condition = current ? weatherCodeToCondition(current.weather_code) : 'unknown';
  const icon = WEATHER_ICONS[condition];

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Unpin button — shows on hover */}
      <button
        onClick={() => dispatch(unpinCity(city.id))}
        title="Remove city"
        className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'var(--border-strong)', color: 'var(--text-3)' }}
      >
        ✕
      </button>

      <Link href={`/city/${slug}`} className="block p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>
              {city.name}
            </p>
            <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>
              {city.country}
            </p>
          </div>
          <span className="text-2xl flex-shrink-0 ml-2">{icon}</span>
        </div>

        {current && (
          <>
            <p className="text-3xl font-thin mb-2" style={{ color: 'var(--text)' }}>
              {Math.round(current.temperature_2m)}°
              <span className="text-lg" style={{ color: 'var(--text-3)' }}>C</span>
            </p>
            <div className="flex gap-2 text-[11px]" style={{ color: 'var(--text-3)' }}>
              <span>💧 {current.relative_humidity_2m}%</span>
              <span>💨 {Math.round(current.wind_speed_10m)} km/h</span>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
