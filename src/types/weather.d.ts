export interface WeatherCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  weather_code: number;
  uv_index: number;
  surface_pressure: number;
  precipitation: number;
  is_day: number;
}

export interface WeatherHourly {
  time: string[];
  temperature_2m: number[];
  wind_speed_10m: number[];
  precipitation_probability: number[];
  relative_humidity_2m: number[];
}

export interface WeatherDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  current: WeatherCurrent;
  hourly: WeatherHourly;
  daily: WeatherDaily;
  fetchedAt: number;
}

export interface WeatherSliceState {
  cache: Record<string, WeatherData>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'foggy'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown';
