import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  authInitialized: false, // 🔑 added
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.permissions = action.payload.user?.permissions || [];
      state.isAuthenticated = true;
      state.authInitialized = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.authInitialized = true; // 🔑 mark initialized
    },
  },
});

export const { setLogin, clearAuth } = authSlice.actions;
export default authSlice.reducer;
