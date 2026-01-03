import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,  // initially logged out
  user: null,
  tokens: null, // access & refresh token placeholder
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.tokens = null;
    },
  },
});

export const { setLogin, logout } = authSlice.actions;
export default authSlice.reducer;
