'use client';

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import {
  setPermissionStatus,
  setCoords,
  setLocationError,
  setCityName,
} from '@/store/slices/locationSlice';
import { reverseGeocode } from '@/lib/geocode';

export function useGeolocation() {
  const dispatch = useDispatch<AppDispatch>();
  const { coords, permissionStatus, error, cityName } = useSelector(
    (state: RootState) => state.location
  );

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setPermissionStatus('unavailable'));
      dispatch(setLocationError('Geolocation is not supported by your browser'));
      return;
    }

    dispatch(setPermissionStatus('requesting'));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setPermissionStatus('granted'));
        dispatch(setCoords({ lat: latitude, lng: longitude }));

        try {
          const name = await reverseGeocode(latitude, longitude);
          dispatch(setCityName(name));
        } catch {
          dispatch(setCityName('Your Location'));
        }
      },
      (err) => {
        dispatch(setPermissionStatus('denied'));
        dispatch(setLocationError(err.message));
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [dispatch]);

  useEffect(() => {
    // Check existing permission on mount
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        } else if (result.state === 'denied') {
          dispatch(setPermissionStatus('denied'));
        }
        result.onchange = () => {
          if (result.state === 'granted') requestLocation();
          else if (result.state === 'denied') dispatch(setPermissionStatus('denied'));
        };
      });
    }
  }, [dispatch, requestLocation]);

  return { coords, permissionStatus, error, cityName, requestLocation };
}
