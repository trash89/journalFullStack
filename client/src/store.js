import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import clientReducer from "./features/client/clientSlice";
import projectReducer from "./features/project/projectSlice";
import subprojectReducer from "./features/subproject/subprojectSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    project: projectReducer,
    subproject: subprojectReducer,
  },
});
