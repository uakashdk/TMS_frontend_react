import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice.js";
import tmsReducer from "./features/tms/tmsSlice.js"; // placeholder for TMS slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tms: tmsReducer,
  },
});
