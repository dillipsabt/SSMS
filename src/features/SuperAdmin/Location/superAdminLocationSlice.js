import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../../utils/createAppAsyncThunk";
import {
  getSuperAdminCities,
  getSuperAdminCountries,
  getSuperAdminStates,
} from "./superAdminLocationAPI";

export const fetchSuperAdminCountriesAsync = createAppAsyncThunk(
  "superAdminLocation/fetchCountries",
  getSuperAdminCountries,
);

export const fetchSuperAdminStatesAsync = createAppAsyncThunk(
  "superAdminLocation/fetchStates",
  (countryId) => getSuperAdminStates(countryId),
);

export const fetchSuperAdminCitiesAsync = createAppAsyncThunk(
  "superAdminLocation/fetchCities",
  (stateId) => getSuperAdminCities(stateId),
);

const initialState = {
  countries: [],
  states: [],
  cities: [],
  loading: false,
  error: null,
};

const superAdminLocationSlice = createSlice({
  name: "superAdminLocation",
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
      .addCase(fetchSuperAdminCountriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminCountriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSuperAdminCountriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Unable to load countries";
      })
      .addCase(fetchSuperAdminStatesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminStatesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.states = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSuperAdminStatesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Unable to load states";
      })
      .addCase(fetchSuperAdminCitiesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminCitiesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSuperAdminCitiesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Unable to load cities";
      });
  },
});

export const { clearCities, clearStates } = superAdminLocationSlice.actions;
export default superAdminLocationSlice.reducer;
