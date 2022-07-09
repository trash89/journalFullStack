import { createSlice } from "@reduxjs/toolkit";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    loginUser: (state, { payload }) => {
      state.user = payload;
      state.isSidebarOpen = false;
      state.isLoading = false;
    },
    registerUser: (state, { payload }) => {
      state.user = payload;
      state.isSidebarOpen = false;
      state.isLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      state.isLoading = false;
      removeUserFromLocalStorage();
    },
  },
});

export const { toggleSidebar, loginUser, logoutUser, registerUser } =
  userSlice.actions;
export default userSlice.reducer;
