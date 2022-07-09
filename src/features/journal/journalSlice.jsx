import { createSlice } from "@reduxjs/toolkit";

import moment from "moment";

const initialState = {
  isLoading: false,
  input: {
    idProfile: "",
    idClient: "",
    idProject: "",
    idSubproject: "",
    idJournal: "",
    EntryDate: new moment().format("YYYY-MM-DD"),
    Description: "",
    Todos: "",
    ThingsDone: "",
  },
  isErrorInput: {
    idProfile: false,
    idClient: false,
    idProject: false,
    idSubproject: false,
    idJournal: false,
    EntryDate: false,
    Description: false,
    Todos: false,
    ThingsDone: false,
  },
  status: "pending",
  isEditing: false,
  editId: "",
};

const journalSlice = createSlice({
  name: "journal",
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
  journalSlice.actions;

export default journalSlice.reducer;
