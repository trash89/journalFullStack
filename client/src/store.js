import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import clientReducer from "./features/client/clientSlice";
import projectReducer from "./features/project/projectSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    project: projectReducer,
  },
});
