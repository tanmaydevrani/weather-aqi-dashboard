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

// Map condition to gradient colors
const CONDITION_GRADIENTS: Record<string, [string, string]> = {
  clear: ['#1d4ed8', '#7c3aed'],
  'partly-cloudy': ['#1e40af', '#4f46e5'],
  cloudy: ['#374151', '#6b7280'],
  foggy: ['#4b5563', '#9ca3af'],
  drizzle: ['#1e40af', '#0284c7'],
  rain: ['#1e3a8a', '#0369a1'],
  snow: ['#1e40af', '#6366f1'],
  thunderstorm: ['#1f2937', '#4b5563'],
  unknown: ['#1e40af', '#6366f1'],
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
  const [gradStart, gradEnd] = CONDITION_GRADIENTS[condition];
  const windDir = getWindDirection(current.wind_direction_10m);
  const isDay = current.is_day === 1;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
      style={{
        background: isDay
          ? `linear-gradient(135deg, ${gradStart}dd, ${gradEnd}cc)`
          : `linear-gradient(135deg, #0f172a, #1e1b4b)`,
      }}
    >
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{cityName}</h2>
            {country && <p className="text-white/50 text-sm mt-0.5">{country}</p>}
          </div>
          <span className="text-5xl sm:text-6xl" role="img" aria-label={label}>
            {icon}
          </span>
        </div>

        {/* Temperature */}
        <div className="mb-5">
          <div className="flex items-end gap-2">
            <span className="text-7xl sm:text-8xl font-thin text-white tabular-nums">
              {Math.round(current.temperature_2m)}°
            </span>
            <div className="mb-3 space-y-0.5">
              <p className="text-white/80 font-medium text-sm sm:text-base">{label}</p>
              <p className="text-white/50 text-xs sm:text-sm">
                Feels like {Math.round(current.apparent_temperature)}°C
              </p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
    <div className="rounded-xl px-3 py-2.5 border border-white/10 bg-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs">{icon}</span>
        <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-white font-semibold text-xs sm:text-sm truncate">{value}</p>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}
