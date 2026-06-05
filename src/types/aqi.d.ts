export interface AqiCurrent {
  pm2_5: number;
  pm10: number;
  nitrogen_dioxide: number;
  ozone: number;
  european_aqi: number;
  us_aqi: number;
  carbon_monoxide: number;
  sulphur_dioxide: number;
}

export interface AqiHourly {
  time: string[];
  pm2_5: number[];
  pm10: number[];
  nitrogen_dioxide: number[];
  ozone: number[];
  european_aqi: number[];
  us_aqi: number[];
}

export interface AqiData {
  latitude: number;
  longitude: number;
  current: AqiCurrent;
  hourly: AqiHourly;
  fetchedAt: number;
}

export interface AqiSliceState {
  cache: Record<string, AqiData>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

export type AqiLevel = 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AqiInfo {
  level: AqiLevel;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}
