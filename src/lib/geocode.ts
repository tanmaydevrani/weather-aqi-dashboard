import type { SearchResult } from '@/store/slices/searchSlice';

const BASE_URL = 'https://nominatim.openstreetmap.org';

interface NominatimResult {
  place_id: number;
  display_name: string;
  name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export async function geocodeCity(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '8',
    featuretype: 'city',
  });

  const res = await fetch(`${BASE_URL}/search?${params}`, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'WeatherAQIDashboard/1.0' },
  });

  if (!res.ok) throw new Error(`Geocode error: ${res.status}`);

  const data: NominatimResult[] = await res.json();

  return data
    .filter((r) => r.address.country)
    .map((r) => {
      const cityName = r.address.city || r.address.town || r.address.village || r.name;
      return {
        id: String(r.place_id),
        name: cityName,
        displayName: r.display_name,
        country: r.address.country ?? '',
        state: r.address.state,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
      };
    });
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lng.toString(),
    format: 'json',
    addressdetails: '1',
  });

  const res = await fetch(`${BASE_URL}/reverse?${params}`, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'WeatherAQIDashboard/1.0' },
  });

  if (!res.ok) throw new Error(`Reverse geocode error: ${res.status}`);
  const data = await res.json();

  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    'Unknown Location'
  );
}
