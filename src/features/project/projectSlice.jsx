import { createSlice } from "@reduxjs/toolkit";

import moment from "moment";

const initialState = {
  isLoading: false,
  input: {
    idClient: "",
    Name: "",
    Description: "",
    isDefault: "N",
    StartDate: new moment().format("YYYY-MM-DD"),
    EndDate: "",
    Finished: "N",
  },
  isErrorInput: {
    idClient: false,
    Name: false,
    Description: false,
    isDefault: false,
    StartDate: false,
    EndDate: false,
    Finished: false,
  },
  status: "pending",
  isEditing: false,
  editId: "",
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setInput: (state, { payload: { name, value } }) => {
      state.input[name] = value;
      if (state.isErrorInput[name]) state.isErrorInput[name] = false;
    },
    setErrorInput: (state, { payload: { name } }) => {
      state.isErrorInput[name] = true;
    },
    clearValues: () => {
      return initialState;
    },
    setEdit: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
});

export const { setInput, setErrorInput, clearValues, setEdit } =
  projectSlice.actions;

export default projectSlice.reducer;
