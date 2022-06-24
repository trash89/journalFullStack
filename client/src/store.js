import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import clientReducer from "./features/client/clientSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
  },
});
