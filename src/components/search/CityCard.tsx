'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import type { AppDispatch, RootState } from '@/store';
import { fetchWeatherThunk } from '@/store/slices/weatherSlice';
import { unpinCity } from '@/store/slices/citiesSlice';
import type { City } from '@/store/slices/citiesSlice';
import { weatherCodeToCondition } from '@/lib/weatherHelpers';
import { Skeleton } from '@/components/ui/Skeleton';

const WEATHER_ICONS: Record<string, string> = {
  clear: '☀️', 'partly-cloudy': '⛅', cloudy: '☁️', foggy: '🌫️',
  drizzle: '🌦️', rain: '🌧️', snow: '❄️', thunderstorm: '⛈️', unknown: '🌡️',
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

  const slug = `${city.name.toLowerCase().replace(/\s+/g, '-')}-${city.lat.toFixed(2)}-${city.lng.toFixed(2)}`;

  if (loading && !weatherData) {
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
        <p className="text-red-400 text-sm font-medium">{city.name}</p>
        <p className="text-red-400/60 text-xs mt-1">Failed to load</p>
      </div>
    );
  }

  const current = weatherData?.current;
  const condition = current ? weatherCodeToCondition(current.weather_code) : 'unknown';
  const icon = WEATHER_ICONS[condition];

  return (
    <div className="group relative rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all overflow-hidden">
      {/* Unpin button */}
      <button
        onClick={() => dispatch(unpinCity(city.id))}
        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/30 text-white/30 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs"
        title="Remove city"
      >
        ✕
      </button>

      <Link href={`/city/${slug}`} className="block p-4">
        {/* City name */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-white font-semibold text-sm">{city.name}</p>
            <p className="text-white/40 text-xs">{city.country}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Temperature */}
        {current && (
          <>
            <p className="text-white text-3xl font-thin mb-2">
              {Math.round(current.temperature_2m)}°<span className="text-lg">C</span>
            </p>
            <div className="flex gap-3 text-xs text-white/40">
              <span>💧 {current.relative_humidity_2m}%</span>
              <span>💨 {Math.round(current.wind_speed_10m)} km/h</span>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
