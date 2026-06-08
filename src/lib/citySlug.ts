// Uses underscores to separate lat/lng so negative values don't break the split
export function buildCitySlug(name: string, lat: number, lng: number): string {
  const safeName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `${safeName}_${lat.toFixed(3)}_${lng.toFixed(3)}`;
}

export function parseCitySlug(slug: string): { name: string; lat: number; lng: number } | null {
  const lastUnderscore = slug.lastIndexOf('_');
  const secondLastUnderscore = slug.lastIndexOf('_', lastUnderscore - 1);

  if (lastUnderscore === -1 || secondLastUnderscore === -1) return null;

  const namePart = slug.slice(0, secondLastUnderscore);
  const latStr = slug.slice(secondLastUnderscore + 1, lastUnderscore);
  const lngStr = slug.slice(lastUnderscore + 1);

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  if (isNaN(lat) || isNaN(lng)) return null;

  const name = namePart
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return { name, lat, lng };
}
