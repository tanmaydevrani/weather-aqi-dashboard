import type { WeatherData } from '@/types/weather.d';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const CURRENT_PARAMS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_direction_10m',
  'weather_code',
  'uv_index',
  'surface_pressure',
  'precipitation',
  'is_day',
].join(',');

const HOURLY_PARAMS = [
  'temperature_2m',
  'wind_speed_10m',
  'precipitation_probability',
  'relative_humidity_2m',
].join(',');

const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'uv_index_max',
  'wind_speed_10m_max',
].join(',');

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { next: { revalidate: 600 } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    forecast_days: '7',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  });

  const res = await fetchWithRetry(`${BASE_URL}?${params}`);
  const json = await res.json();

  return {
    latitude: json.latitude,
    longitude: json.longitude,
    current: json.current,
    hourly: json.hourly,
    daily: json.daily,
    fetchedAt: Date.now(),
  };
}
