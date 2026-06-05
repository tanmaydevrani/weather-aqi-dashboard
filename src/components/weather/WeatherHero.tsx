'use client';

import { weatherCodeToCondition } from '@/lib/weatherHelpers';
import type { WeatherData } from '@/types/weather.d';

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

const CONDITION_LABELS: Record<string, string> = {
  clear: 'Clear Sky',
  'partly-cloudy': 'Partly Cloudy',
  cloudy: 'Overcast',
  foggy: 'Foggy',
  drizzle: 'Light Drizzle',
  rain: 'Rainy',
  snow: 'Snowing',
  thunderstorm: 'Thunderstorm',
  unknown: 'Unknown',
};

interface WeatherHeroProps {
  data: WeatherData;
  cityName: string;
  country?: string;
}

export function WeatherHero({ data, cityName, country }: WeatherHeroProps) {
  const { current } = data;
  const condition = weatherCodeToCondition(current.weather_code);
  const icon = WEATHER_ICONS[condition];
  const label = CONDITION_LABELS[condition];

  const windDir = getWindDirection(current.wind_direction_10m);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-white/10 p-8 backdrop-blur-sm">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{cityName}</h2>
            {country && <p className="text-white/50 text-sm mt-0.5">{country}</p>}
          </div>
          <span className="text-6xl" role="img" aria-label={label}>{icon}</span>
        </div>

        {/* Temperature */}
        <div className="mb-6">
          <div className="flex items-end gap-3">
            <span className="text-8xl font-thin text-white tracking-tighter">
              {Math.round(current.temperature_2m)}°
            </span>
            <div className="mb-4 space-y-1">
              <p className="text-white/70 font-medium">{label}</p>
              <p className="text-white/40 text-sm">
                Feels like {Math.round(current.apparent_temperature)}°C
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatChip icon="💧" label="Humidity" value={`${current.relative_humidity_2m}%`} />
          <StatChip icon="💨" label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h ${windDir}`} />
          <StatChip icon="🌡️" label="Pressure" value={`${Math.round(current.surface_pressure)} hPa`} />
          <StatChip icon="☀️" label="UV Index" value={current.uv_index.toFixed(1)} />
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-white/40 text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-white font-semibold text-sm">{value}</p>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}
