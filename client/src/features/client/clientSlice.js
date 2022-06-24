import { createSlice } from "@reduxjs/toolkit";

import moment from "moment";

const initialState = {
  isLoading: false,
  input: {
    Name: "",
    Description: "",
    StartDate: new moment().format("YYYY-MM-DD"),
    EndDate: "",
  },
  isErrorInput: {
    Name: false,
    Description: false,
    StartDate: false,
    EndDate: false,
  },
  status: "pending",
  isEditing: false,
  editIdClient: "",
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state.input[name] = value;
      if (state.isErrorInput[name]) state.isErrorInput[name] = false;
    },
    setErrorInput: (state, { payload: { name } }) => {
      state.isErrorInput[name] = true;
    },

    clearValues: () => {
      return initialState;
    },
    setEditClient: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
});

export const { handleChange, setErrorInput, clearValues, setEditClient } = clientSlice.actions;

export default clientSlice.reducer;