'use client';

import { getAqiInfo } from '@/lib/aqiHelpers';
import type { AqiData } from '@/types/aqi.d';

interface AqiGaugeProps {
  data: AqiData;
}

const AQI_BANDS = [
  { max: 50, color: '#22c55e', label: '0–50' },
  { max: 100, color: '#eab308', label: '51–100' },
  { max: 150, color: '#f97316', label: '101–150' },
  { max: 200, color: '#ef4444', label: '151–200' },
  { max: 300, color: '#a855f7', label: '201–300' },
  { max: 500, color: '#7f1d1d', label: '301+' },
];

export function AqiGauge({ data }: AqiGaugeProps) {
  const aqi = data.current.us_aqi;
  const info = getAqiInfo(aqi);

  const radius = 68;
  const stroke = 11;
  const r = radius - stroke / 2;
  const circumference = Math.PI * r;
  const offset = circumference - Math.min(aqi / 500, 1) * circumference;

  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${info.color}28`,
        boxShadow: 'var(--shadow)',
      }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--text-3)' }}>
        Air Quality Index
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Gauge */}
        <div className="relative flex-shrink-0">
          <svg
            width={radius * 2 + stroke}
            height={radius + stroke + 16}
            viewBox={`0 0 ${radius * 2 + stroke} ${radius + stroke + 16}`}
          >
            {/* Track */}
            <path
              d={describeArc(radius + stroke / 2, radius + stroke / 2, r, -180, 0)}
              fill="none"
              stroke="rgba(128,128,128,0.15)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d={describeArc(radius + stroke / 2, radius + stroke / 2, r, -180, 0)}
              fill="none"
              stroke={info.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
            />
            {/* AQI value */}
            <text
              x={radius + stroke / 2}
              y={radius + stroke / 2 - 8}
              textAnchor="middle"
              fill="currentColor"
              fontSize="30"
              fontWeight="300"
              fontFamily="-apple-system, sans-serif"
              className="text-[var(--text)]"
            >
              {aqi}
            </text>
            <text
              x={radius + stroke / 2}
              y={radius + stroke / 2 + 13}
              textAnchor="middle"
              fill={info.color}
              fontSize="10"
              fontWeight="600"
              letterSpacing="1.5"
            >
              US AQI
            </text>
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left w-full">
          <span
            className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
            style={{ background: info.bgColor, color: info.color }}
          >
            {info.label}
          </span>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-3)' }}>
            {info.description}
          </p>

          {/* Color scale */}
          <div className="flex gap-1 h-2">
            {AQI_BANDS.map((band, i) => {
              const prev = i === 0 ? 0 : AQI_BANDS[i - 1].max;
              const active = aqi > prev && aqi <= band.max;
              return (
                <div
                  key={band.max}
                  className="flex-1 rounded-full transition-all duration-300"
                  style={{
                    background: band.color,
                    opacity: active ? 1 : 0.22,
                    transform: active ? 'scaleY(1.3)' : 'scaleY(1)',
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>Good</span>
            <span className="text-[10px]" style={{ color: 'var(--text-4)' }}>Hazardous</span>
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

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, end);
  const e = polarToCartesian(cx, cy, r, start);
  const large = end - start <= 180 ? '0' : '1';
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
