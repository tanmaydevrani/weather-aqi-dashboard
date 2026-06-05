'use client';

import { weatherCodeToCondition } from '@/lib/weatherHelpers';
import type { WeatherData } from '@/types/weather.d';

const WEATHER_ICONS: Record<string, string> = {
  clear: '☀️', 'partly-cloudy': '⛅', cloudy: '☁️', foggy: '🌫️',
  drizzle: '🌦️', rain: '🌧️', snow: '❄️', thunderstorm: '⛈️', unknown: '🌡️',
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface ForecastStripProps {
  data: WeatherData;
}

export function ForecastStrip({ data }: ForecastStripProps) {
  const { daily } = data;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">7-Day Forecast</h3>
      <div className="grid grid-cols-7 gap-2">
        {daily.time.map((dateStr, i) => {
          const date = new Date(dateStr);
          const dayLabel = i === 0 ? 'Today' : DAY_LABELS[date.getDay()];
          const condition = weatherCodeToCondition(daily.weather_code[i]);
          const icon = WEATHER_ICONS[condition];
          const max = Math.round(daily.temperature_2m_max[i]);
          const min = Math.round(daily.temperature_2m_min[i]);
          const rain = daily.precipitation_sum[i];

          return (
            <div
              key={dateStr}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
            >
              <span className="text-white/50 text-xs font-medium">{dayLabel}</span>
              <span className="text-2xl" role="img" aria-label={condition}>{icon}</span>
              <div className="text-center">
                <p className="text-white font-semibold text-sm">{max}°</p>
                <p className="text-white/40 text-xs">{min}°</p>
              </div>
              {rain > 0 && (
                <div className="flex items-center gap-0.5">
                  <span className="text-blue-400 text-xs">💧</span>
                  <span className="text-blue-400 text-xs">{rain.toFixed(1)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
