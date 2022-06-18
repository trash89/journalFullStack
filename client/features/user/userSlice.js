import { createSlice } from "@reduxjs/toolkit";

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
  user: user ? JSON.parse(user) : null,
  token: token,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logoutUser: (state, action) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
