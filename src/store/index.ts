import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import citiesReducer from './slices/citiesSlice';
import weatherReducer from './slices/weatherSlice';
import searchReducer from './slices/searchSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    cities: citiesReducer,
    weather: weatherReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['weather/fetch/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
