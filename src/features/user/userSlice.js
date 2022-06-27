import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getUserFromLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";

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
      if (payload) {
        toast.success(`Hello Again, ${state.user.Username} !`);
      }
    },
    registerUser: (state, { payload }) => {
      state.user = payload;
      state.isSidebarOpen = false;
      state.isLoading = false;
      if (payload) {
        toast.success(`Hello, ${state.user.Username} !`);
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.isSidebarOpen = false;
      state.isLoading = false;
      removeUserFromLocalStorage();
    },
  },
});

export const { toggleSidebar, loginUser, logoutUser, registerUser } = userSlice.actions;
export default userSlice.reducer;
