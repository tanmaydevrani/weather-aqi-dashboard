'use client';

import { getAqiInfo } from '@/lib/aqiHelpers';
import type { AqiData } from '@/types/aqi.d';

interface AqiGaugeProps {
  data: AqiData;
}

export function AqiGauge({ data }: AqiGaugeProps) {
  const aqi = data.current.us_aqi;
  const info = getAqiInfo(aqi);

  // SVG gauge math
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = Math.PI * normalizedRadius; // half circle
  const offset = circumference - Math.min(aqi / 500, 1) * circumference;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm" style={{ borderColor: `${info.color}30` }}>
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Air Quality Index</h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Gauge SVG */}
        <div className="relative flex-shrink-0">
          <svg
            width={radius * 2 + stroke}
            height={radius + stroke + 20}
            viewBox={`0 0 ${radius * 2 + stroke} ${radius + stroke + 20}`}
          >
            {/* Background arc */}
            <path
              d={describeArc(radius + stroke / 2, radius + stroke / 2, normalizedRadius, -180, 0)}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d={describeArc(radius + stroke / 2, radius + stroke / 2, normalizedRadius, -180, 0)}
              fill="none"
              stroke={info.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s' }}
            />
            {/* AQI Number */}
            <text
              x={radius + stroke / 2}
              y={radius + stroke / 2 - 10}
              textAnchor="middle"
              fill="white"
              fontSize="32"
              fontWeight="300"
              fontFamily="monospace"
            >
              {aqi}
            </text>
            <text
              x={radius + stroke / 2}
              y={radius + stroke / 2 + 14}
              textAnchor="middle"
              fill={info.color}
              fontSize="11"
              fontWeight="600"
              letterSpacing="1"
            >
              US AQI
            </text>
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div
            className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
            style={{ background: info.bgColor, color: info.color }}
          >
            {info.label}
          </div>
          <p className="text-white/50 text-sm leading-relaxed">{info.description}</p>

          {/* AQI Scale */}
          <div className="mt-4 flex gap-1">
            {[
              { max: 50, color: '#22c55e' },
              { max: 100, color: '#eab308' },
              { max: 150, color: '#f97316' },
              { max: 200, color: '#ef4444' },
              { max: 300, color: '#a855f7' },
              { max: 500, color: '#7f1d1d' },
            ].map((band) => (
              <div
                key={band.max}
                className="h-2 flex-1 rounded-full opacity-60"
                style={{
                  background: band.color,
                  opacity: aqi <= band.max && (aqi > (band.max - 50) || band.max === 50) ? 1 : 0.25,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}
