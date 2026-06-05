import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData, WeatherSliceState } from '@/types/weather.d';

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const fetchWeatherThunk = createAsyncThunk(
  'weather/fetch',
  async ({ lat, lng }: { lat: number; lng: number }, { rejectWithValue }) => {
    try {
      const { fetchWeather } = await import('@/lib/weatherApi');
      const data = await fetchWeather(lat, lng);
      return { key: `${lat},${lng}`, data };
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch weather');
    }
  },
  {
    condition({ lat, lng }, { getState }) {
      const state = getState() as { weather: WeatherSliceState };
      const key = `${lat},${lng}`;
      const cached = state.weather.cache[key];
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return false;
      return true;
    },
  }
);

const initialState: WeatherSliceState = {
  cache: {},
  loading: {},
  error: {},
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    invalidateCache(state, action: PayloadAction<string>) {
      delete state.cache[action.payload];
    },
    clearAllCache(state) {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherThunk.pending, (state, action) => {
        const key = `${action.meta.arg.lat},${action.meta.arg.lng}`;
        state.loading[key] = true;
        state.error[key] = null;
      })
      .addCase(fetchWeatherThunk.fulfilled, (state, action) => {
        const { key, data } = action.payload;
        state.cache[key] = data;
        state.loading[key] = false;
        state.error[key] = null;
      })
      .addCase(fetchWeatherThunk.rejected, (state, action) => {
        const key = `${action.meta.arg.lat},${action.meta.arg.lng}`;
        state.loading[key] = false;
        state.error[key] = action.payload as string;
      });
  },
});

export const { invalidateCache, clearAllCache } = weatherSlice.actions;
export default weatherSlice.reducer;
