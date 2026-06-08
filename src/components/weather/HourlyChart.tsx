'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '@/components/layout/ThemeProvider';
import type { WeatherData } from '@/types/weather.d';

interface HourlyChartProps {
  data: WeatherData;
}

export function HourlyChart({ data }: HourlyChartProps) {
  const { hourly } = data;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartData = hourly.time.slice(0, 24).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    temp: Math.round(hourly.temperature_2m[i]),
    wind: Math.round(hourly.wind_speed_10m[i]),
    rain: hourly.precipitation_probability[i],
  }));

  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const axisColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
  const tooltipBg = isDark ? '#0f0f15' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const tooltipText = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  const labelText = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="rounded-xl p-3 text-sm shadow-xl"
        style={{ background: tooltipBg, border: `1px solid ${tooltipBorder}` }}
      >
        <p className="text-xs mb-2" style={{ color: tooltipText }}>{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
            <span className="text-xs" style={{ color: labelText }}>{entry.name}:</span>
            <span className="text-xs font-semibold" style={{ color: isDark ? '#fff' : '#111' }}>
              {entry.value}
              {entry.name === 'Temp' ? '°C' : entry.name === 'Wind' ? ' km/h' : '%'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-3)' }}>
        Hourly Forecast · 24h
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="time"
            tick={{ fill: axisColor, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fill: axisColor, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={{ fill: axisColor, fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: axisColor, fontSize: '11px', paddingTop: '8px' }} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            name="Temp"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#60a5fa' }}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="wind"
            name="Wind"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#a78bfa' }}
          />
          <Line
            yAxisId="rain"
            type="monotone"
            dataKey="rain"
            name="Rain %"
            stroke="#34d399"
            strokeWidth={2}
            strokeDasharray="4 2"
            dot={false}
            activeDot={{ r: 4, fill: '#34d399' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
