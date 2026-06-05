import type { AqiData } from '@/types/aqi.d';

const BASE_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

const CURRENT_PARAMS = [
  'pm2_5',
  'pm10',
  'nitrogen_dioxide',
  'ozone',
  'european_aqi',
  'us_aqi',
  'carbon_monoxide',
  'sulphur_dioxide',
].join(',');

const HOURLY_PARAMS = [
  'pm2_5',
  'pm10',
  'nitrogen_dioxide',
  'ozone',
  'european_aqi',
  'us_aqi',
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

export async function fetchAqi(lat: number, lng: number): Promise<AqiData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    timezone: 'auto',
    forecast_days: '3',
  });

  const res = await fetchWithRetry(`${BASE_URL}?${params}`);
  const json = await res.json();

  // Normalise field names (API uses nitrogen_dioxide, ozone etc.)
  const current = {
    pm2_5: json.current?.pm2_5 ?? 0,
    pm10: json.current?.pm10 ?? 0,
    nitrogen_dioxide: json.current?.nitrogen_dioxide ?? 0,
    ozone: json.current?.ozone ?? 0,
    european_aqi: json.current?.european_aqi ?? 0,
    us_aqi: json.current?.us_aqi ?? 0,
    carbon_monoxide: json.current?.carbon_monoxide ?? 0,
    sulphur_dioxide: json.current?.sulphur_dioxide ?? 0,
  };

  return {
    latitude: json.latitude,
    longitude: json.longitude,
    current,
    hourly: json.hourly,
    fetchedAt: Date.now(),
  };
}
