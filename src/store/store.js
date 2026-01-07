import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice.js";
import tmsReducer from "./feature/tms/tmsSlice.js"; // placeholder for TMS slice
import layoutReducer  from "./feature/layOut/layoutSlice.js"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tms: tmsReducer,
    layout: layoutReducer,
  },
});
