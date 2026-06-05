import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PermissionStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export interface Coords {
  lat: number;
  lng: number;
}

export interface LocationState {
  coords: Coords | null;
  permissionStatus: PermissionStatus;
  error: string | null;
  cityName: string | null;
}

const initialState: LocationState = {
  coords: null,
  permissionStatus: 'idle',
  error: null,
  cityName: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setPermissionStatus(state, action: PayloadAction<PermissionStatus>) {
      state.permissionStatus = action.payload;
    },
    setCoords(state, action: PayloadAction<Coords>) {
      state.coords = action.payload;
      state.error = null;
    },
    setLocationError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    setCityName(state, action: PayloadAction<string>) {
      state.cityName = action.payload;
    },
    resetLocation(state) {
      state.coords = null;
      state.permissionStatus = 'idle';
      state.error = null;
      state.cityName = null;
    },
  },
});

export const { setPermissionStatus, setCoords, setLocationError, setCityName, resetLocation } =
  locationSlice.actions;
export default locationSlice.reducer;
