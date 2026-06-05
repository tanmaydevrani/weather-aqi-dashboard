import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface SearchResult {
  id: string;
  name: string;
  displayName: string;
  country: string;
  state?: string;
  lat: number;
  lng: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}

export const searchCitiesThunk = createAsyncThunk(
  'search/cities',
  async (query: string, { rejectWithValue }) => {
    try {
      const { geocodeCity } = await import('@/lib/geocode');
      return await geocodeCity(query);
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Search failed');
    }
  }
);

const initialState: SearchState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  isOpen: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
      state.isOpen = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCitiesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCitiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.isOpen = true;
      })
      .addCase(searchCitiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQuery, setIsOpen, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
