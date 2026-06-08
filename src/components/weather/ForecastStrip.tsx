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

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ForecastStripProps {
  data: WeatherData;
}

export function ForecastStrip({ data }: ForecastStripProps) {
  const { daily } = data;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-3)' }}>
        7-Day Forecast
      </h3>

      {/* Horizontal scroll on mobile, grid on wider screens */}
      <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible scrollbar-thin">
        {daily.time.map((dateStr, i) => {
          const date = new Date(dateStr);
          const dayLabel = i === 0 ? 'Today' : DAY_LABELS[date.getDay()];
          const condition = weatherCodeToCondition(daily.weather_code[i]);
          const icon = WEATHER_ICONS[condition];
          const max = Math.round(daily.temperature_2m_max[i]);
          const min = Math.round(daily.temperature_2m_min[i]);
          const rain = daily.precipitation_sum[i];
          const isToday = i === 0;

          return (
            <div
              key={dateStr}
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl flex-shrink-0 sm:flex-shrink transition-colors min-w-[60px] sm:min-w-0"
              style={{
                background: isToday ? 'var(--accent)' : 'var(--surface-hover)',
                opacity: isToday ? 1 : 0.9,
              }}
            >
              <span
                className="text-[11px] font-semibold"
                style={{ color: isToday ? 'rgba(255,255,255,0.85)' : 'var(--text-3)' }}
              >
                {dayLabel}
              </span>
              <span className="text-xl" role="img" aria-label={condition}>{icon}</span>
              <div className="text-center">
                <p
                  className="font-bold text-sm"
                  style={{ color: isToday ? '#fff' : 'var(--text)' }}
                >
                  {max}°
                </p>
                <p
                  className="text-xs"
                  style={{ color: isToday ? 'rgba(255,255,255,0.6)' : 'var(--text-3)' }}
                >
                  {min}°
                </p>
              </div>
              {rain > 0 && (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isToday ? 'rgba(255,255,255,0.7)' : '#60a5fa' }}
                >
                  💧{rain.toFixed(1)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
