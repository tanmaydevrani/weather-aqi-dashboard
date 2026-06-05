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
  { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', safe: 12, moderate: 35, description: 'Fine particles < 2.5μm. Most harmful to lungs.' },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', safe: 54, moderate: 154, description: 'Coarse particles < 10μm. Affects respiratory system.' },
  { key: 'ozone', label: 'O₃', unit: 'μg/m³', safe: 100, moderate: 160, description: 'Ground-level ozone. Irritates airways.' },
  { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'μg/m³', safe: 40, moderate: 80, description: 'Traffic pollutant. Aggravates asthma.' },
  { key: 'carbon_monoxide', label: 'CO', unit: 'mg/m³', safe: 4, moderate: 9, description: 'Colorless gas from combustion.' },
  { key: 'sulphur_dioxide', label: 'SO₂', unit: 'μg/m³', safe: 20, moderate: 80, description: 'From fossil fuels. Causes acid rain.' },
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
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
      <h3 className="text-white/60 text-sm font-medium uppercase tracking-wider mb-4">Pollutants</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {POLLUTANTS.map((p) => {
          const raw = current[p.key] as number;
          const value = p.key === 'carbon_monoxide' ? raw / 1000 : raw; // convert to mg/m³ for CO
          const displayValue = value.toFixed(1);
          const color = getColor(raw, p.safe, p.moderate);
          const status = getStatus(raw, p.safe, p.moderate);
          const pct = Math.min((raw / (p.moderate * 2)) * 100, 100);

          return (
            <div
              key={p.key}
              className="rounded-xl p-4 border transition-colors"
              style={{
                background: `${color}08`,
                borderColor: `${color}20`,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-bold text-lg">{p.label}</p>
                  <p className="text-white/40 text-xs">{p.unit}</p>
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}20`, color }}
                >
                  {status}
                </span>
              </div>
              <p className="text-white font-mono text-2xl font-light mb-1">{displayValue}</p>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: color,
                    transition: 'width 1s ease-in-out',
                  }}
                />
              </div>
              <p className="text-white/30 text-xs mt-2 leading-tight">{p.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
