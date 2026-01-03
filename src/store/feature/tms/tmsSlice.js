import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: null,
  trips: [],
  companies: [],
};

const tmsSlice = createSlice({
  name: "tms",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
  },
});

export const { setDashboardData, setTrips, setCompanies } = tmsSlice.actions;
export default tmsSlice.reducer;
