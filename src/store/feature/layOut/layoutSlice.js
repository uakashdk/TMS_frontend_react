import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarOpen: JSON.parse(localStorage.getItem("sidebarOpen")) ?? true,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      localStorage.setItem("sidebarOpen", JSON.stringify(state.sidebarOpen));
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;
export default layoutSlice.reducer;
