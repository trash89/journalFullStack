import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import clientReducer from "./features/client/clientSlice";
import projectReducer from "./features/project/projectSlice";
import subprojectReducer from "./features/subproject/subprojectSlice";
import journalReducer from "./features/journal/journalSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    project: projectReducer,
    subproject: subprojectReducer,
    journal: journalReducer,
  },
});
