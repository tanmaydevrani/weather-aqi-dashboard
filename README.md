# Weather & AQI Dashboard

A real-time weather and air quality dashboard built with Next.js 15, Redux Toolkit, and the Open-Meteo API. No API keys needed — completely free to run.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2-purple?style=flat-square&logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

---

## What it does

- Shows current weather for your GPS location — temperature, humidity, wind, UV index, pressure
- 7-day daily forecast strip with high/low temps
- 24-hour chart for temperature, wind speed, and rain probability (Recharts)
- US AQI gauge + pollutant breakdown (PM2.5, PM10, NO₂, O₃, CO, SO₂)
- City search powered by Nominatim — pin multiple cities as cards
- Each city has its own detail page at `/city/[slug]`
- Auto-refreshes every 10 minutes in the background
- Data cached in Redux so switching between pages doesn't re-fetch

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components + client islands pattern |
| Language | TypeScript 5 | Strict types across API responses and Redux state |
| State | Redux Toolkit | Thunks for async fetching, normalized cache by lat/lng key |
| Styling | Tailwind CSS 3 | Utility-first, dark theme, no extra CSS files |
| Charts | Recharts | Composable, works well with responsive containers |
| Weather API | Open-Meteo | Free, no auth, solid uptime |
| Geocoding | Nominatim (OSM) | Free reverse + forward geocoding |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — GPS location + pinned cities
│   ├── layout.tsx            # Root layout, Redux provider, header
│   └── city/[slug]/page.tsx  # City detail page
├── components/
│   ├── aqi/                  # AqiGauge (SVG arc), PollutantGrid
│   ├── weather/              # WeatherHero, ForecastStrip, HourlyChart, StatRow
│   ├── search/               # SearchBar (debounced), CityCard
│   ├── layout/               # Header, ReduxProvider
│   └── ui/                   # ErrorBoundary, Skeleton loaders
├── store/
│   ├── index.ts              # configureStore
│   └── slices/               # locationSlice, citiesSlice, weatherSlice, searchSlice
├── lib/
│   ├── weatherApi.ts         # Open-Meteo weather fetch with retry
│   ├── aqiApi.ts             # Open-Meteo air quality fetch with retry
│   ├── geocode.ts            # Nominatim city search
│   ├── weatherHelpers.ts     # WMO weather code → condition string
│   ├── aqiHelpers.ts         # AQI breakpoints → label/color
│   └── utils.ts              # cn() helper (clsx + tailwind-merge)
├── hooks/
│   ├── useGeolocation.ts     # Browser Geolocation API wrapper
│   └── useDebounce.ts        # Generic debounce hook
└── types/
    ├── weather.d.ts           # WeatherData type (Open-Meteo shape)
    └── aqi.d.ts               # AqiData type
```

---

## Getting Started

```bash
git clone https://github.com/t_anmay1998/weather-aqi-dashboard.git
cd weather-aqi-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no `.env` file, no API keys.

---

## Key Implementation Notes

**Redux cache keyed by coordinates** — weather data is stored as `cache["lat,lng"]` so multiple cities don't step on each other and navigating back to a pinned city is instant.

**Retry logic on API calls** — both `weatherApi.ts` and `aqiApi.ts` use an exponential backoff retry (up to 3 attempts) so a flaky network doesn't break the UI.

**SVG AQI gauge** — the arc in `AqiGauge.tsx` is hand-rolled SVG math (polar to Cartesian conversion) rather than a library, keeping the bundle small.

**Debounced city search** — the search input debounces at 400ms before dispatching, so we're not hitting Nominatim on every keystroke.

**Auto-refresh** — `setInterval` in the home page re-fetches weather every 10 minutes; the interval is cleaned up on unmount.

---

## Screenshots

> *Coming soon — will add after deploying to Vercel*

---

## Roadmap

- [ ] Deploy to Vercel
- [ ] Add AQI hourly trend chart
- [ ] Celsius / Fahrenheit toggle
- [ ] Dark/light mode switch
- [ ] PWA support (offline fallback)

---

## License

MIT
