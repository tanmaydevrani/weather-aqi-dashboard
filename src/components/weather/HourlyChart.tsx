'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import type { WeatherData } from '@/types/weather.d';

interface HourlyChartProps {
  data: WeatherData;
}

export function HourlyChart({ data }: HourlyChartProps) {
  const { hourly } = data;

  // Show next 24 hours
  const chartData = hourly.time.slice(0, 24).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    temp: Math.round(hourly.temperature_2m[i]),
    wind: Math.round(hourly.wind_speed_10m[i]),
    rain: hourly.precipitation_probability[i],
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-gray-900 border border-white/10 rounded-xl p-3 text-sm shadow-xl">
        <p className="text-white/50 text-xs mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-white/70">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}{entry.name === 'Temp' ? '°C' : entry.name === 'Wind' ? ' km/h' : '%'}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">
        Hourly Forecast (24h)
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="rain"
            orientation="right"
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}
          />
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
