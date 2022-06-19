import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const getStorLocal = (item) => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(item);
  }
  return null;
};
const setStorLocal = (item, value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(item, value);
  }
};

const token = getStorLocal("token");
const user = getStorLocal("user");

const initialState = {
  Username: user ? JSON.parse(user) : null,
  Password: "",
  token: token,
  isLoading: false,
  isSidebarOpen: false,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log("action=", action);
      state.user = action.payload.Username;
      state.Password = action.payload.Password;
    },
    registerUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.user;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    logoutUser: (state, { payload }) => {
      state.user = null;
      state.isSidebarOpen = false;
      //removeUserFromLocalStorage();
      if (payload) {
        toast.success(payload);
      }
    },
  },
});

export const { loginUser, registerUser } = userSlice.actions;
export default userSlice.reducer;
