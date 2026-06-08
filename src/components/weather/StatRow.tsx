'use client';

import type { WeatherData } from '@/types/weather.d';

interface StatRowProps {
  data: WeatherData;
}

export function StatRow({ data }: StatRowProps) {
  const { current } = data;

  const stats = [
    {
      icon: '💧',
      label: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      bar: current.relative_humidity_2m,
      barColor: '#60a5fa',
    },
    {
      icon: '☀️',
      label: 'UV Index',
      value: getUvLabel(current.uv_index),
      bar: Math.min((current.uv_index / 11) * 100, 100),
      barColor: getUvColor(current.uv_index),
    },
    {
      icon: '🌡️',
      label: 'Pressure',
      value: `${Math.round(current.surface_pressure)} hPa`,
      bar: Math.min(((current.surface_pressure - 950) / 100) * 100, 100),
      barColor: '#a78bfa',
    },
    {
      icon: '🌧️',
      label: 'Precipitation',
      value: `${current.precipitation.toFixed(1)} mm`,
      bar: Math.min(current.precipitation * 10, 100),
      barColor: '#34d399',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-4 transition-colors"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">{stat.icon}</span>
            <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: 'var(--text-3)' }}>
              {stat.label}
            </span>
          </div>
          <p className="font-bold text-base mb-3 truncate" style={{ color: 'var(--text)' }}>
            {stat.value}
          </p>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-strong)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${stat.bar}%`, background: stat.barColor }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function getUvLabel(uv: number): string {
  if (uv <= 2) return `${uv.toFixed(1)} Low`;
  if (uv <= 5) return `${uv.toFixed(1)} Moderate`;
  if (uv <= 7) return `${uv.toFixed(1)} High`;
  if (uv <= 10) return `${uv.toFixed(1)} Very High`;
  return `${uv.toFixed(1)} Extreme`;
}

function getUvColor(uv: number): string {
  if (uv <= 2) return '#22c55e';
  if (uv <= 5) return '#eab308';
  if (uv <= 7) return '#f97316';
  if (uv <= 10) return '#ef4444';
  return '#7c3aed';
}
