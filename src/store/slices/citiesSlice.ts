import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface City {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lng: number;
  pinnedAt: number;
}

export interface CitiesState {
  pinned: City[];
}

// India's 6 mega-cities as fallback defaults
export const FALLBACK_CITIES: City[] = [
  { id: 'mumbai', name: 'Mumbai', country: 'India', state: 'Maharashtra', lat: 19.076, lng: 72.8777, pinnedAt: 0 },
  { id: 'delhi', name: 'Delhi', country: 'India', state: 'Delhi', lat: 28.6139, lng: 77.209, pinnedAt: 0 },
  { id: 'bangalore', name: 'Bangalore', country: 'India', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pinnedAt: 0 },
  { id: 'hyderabad', name: 'Hyderabad', country: 'India', state: 'Telangana', lat: 17.385, lng: 78.4867, pinnedAt: 0 },
  { id: 'chennai', name: 'Chennai', country: 'India', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, pinnedAt: 0 },
  { id: 'kolkata', name: 'Kolkata', country: 'India', state: 'West Bengal', lat: 22.5726, lng: 88.3639, pinnedAt: 0 },
];

const initialState: CitiesState = {
  pinned: FALLBACK_CITIES,
};

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    pinCity(state, action: PayloadAction<Omit<City, 'pinnedAt'>>) {
      const exists = state.pinned.find((c) => c.id === action.payload.id);
      if (!exists) {
        state.pinned.push({ ...action.payload, pinnedAt: Date.now() });
      }
    },
    unpinCity(state, action: PayloadAction<string>) {
      state.pinned = state.pinned.filter((c) => c.id !== action.payload);
    },
    reorderCities(state, action: PayloadAction<City[]>) {
      state.pinned = action.payload;
    },
    setFallbackCities(state) {
      state.pinned = FALLBACK_CITIES;
    },
  },
});

export const { pinCity, unpinCity, reorderCities, setFallbackCities } = citiesSlice.actions;
export default citiesSlice.reducer;
