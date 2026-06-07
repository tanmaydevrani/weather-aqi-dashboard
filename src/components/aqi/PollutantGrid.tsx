'use client';

import type { AqiData } from '@/types/aqi.d';

interface PollutantGridProps {
  data: AqiData;
}

interface PollutantInfo {
  key: keyof AqiData['current'];
  label: string;
  unit: string;
  safe: number;
  moderate: number;
  description: string;
}

const POLLUTANTS: PollutantInfo[] = [
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', safe: 12, moderate: 35, description: 'Fine particles < 2.5μm' },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', safe: 54, moderate: 154, description: 'Coarse particles < 10μm' },
  { key: 'ozone', label: 'O₃', unit: 'μg/m³', safe: 100, moderate: 160, description: 'Ground-level ozone' },
  { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'μg/m³', safe: 40, moderate: 80, description: 'Traffic pollutant' },
  { key: 'carbon_monoxide', label: 'CO', unit: 'mg/m³', safe: 4, moderate: 9, description: 'From combustion' },
  { key: 'sulphur_dioxide', label: 'SO₂', unit: 'μg/m³', safe: 20, moderate: 80, description: 'From fossil fuels' },
];

function getColor(value: number, safe: number, moderate: number) {
  if (value <= safe) return '#22c55e';
  if (value <= moderate) return '#eab308';
  return '#ef4444';
}

function getStatus(value: number, safe: number, moderate: number) {
  if (value <= safe) return 'Good';
  if (value <= moderate) return 'Moderate';
  return 'High';
}

export function PollutantGrid({ data }: PollutantGridProps) {
  const { current } = data;

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
        Pollutant Breakdown
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {POLLUTANTS.map((p) => {
          const raw = current[p.key] as number;
          const displayVal = p.key === 'carbon_monoxide' ? (raw / 1000).toFixed(2) : raw.toFixed(1);
          const color = getColor(raw, p.safe, p.moderate);
          const status = getStatus(raw, p.safe, p.moderate);
          const pct = Math.min((raw / (p.moderate * 2)) * 100, 100);

          return (
            <div
              key={p.key}
              className="rounded-xl p-3.5 transition-colors"
              style={{
                background: `${color}0a`,
                border: `1px solid ${color}22`,
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className="font-bold text-base" style={{ color: 'var(--text)' }}>{p.label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{p.unit}</p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}20`, color }}
                >
                  {status}
                </span>
              </div>
              <p className="font-mono text-xl font-light mb-2" style={{ color: 'var(--text)' }}>
                {displayVal}
              </p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-strong)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: color,
                    transition: 'width 1s ease-in-out',
                  }}
                />
              </div>
              <p className="text-[10px] mt-1.5 leading-snug" style={{ color: 'var(--text-4)' }}>
                {p.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
