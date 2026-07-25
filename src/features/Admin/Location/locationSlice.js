import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCountries, getStates, getCities } from "./locationAPI";

export const fetchCountriesAsync = createAsyncThunk(
  "location/fetchCountries",
  async () => {
    const response = await getCountries();
    return response.data;
  }
);

export const fetchStatesAsync = createAsyncThunk(
  "location/fetchStates",
  async (countryId) => {
    const response = await getStates(countryId);
    return response.data;
  }
);

export const fetchCitiesAsync = createAsyncThunk(
  "location/fetchCities",
  async (stateId) => {
    const response = await getCities(stateId);
    return response.data;
  }
);

const initialState = {
  countries: [],
  states: [],
  cities: [],
  loading: false,
  error: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearStates: (state) => {
      state.states = [];
    },
    clearCities: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchStatesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStatesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(fetchCitiesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitiesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCitiesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearStates, clearCities } = locationSlice.actions;
export default locationSlice.reducer;
