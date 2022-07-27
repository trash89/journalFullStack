import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { useIsMounted, useGetProfile, useGetJournal, useClientsList, useProjectsList, useSubprojectsList } from "../../hooks";

import { setInput, setErrorInput, clearValues, setEdit } from "../../features/journal/journalSlice";

import moment from "moment";

const UPDATE_MUTATION = gql`
  mutation updateMutation(
    $idJournal: ID!
    $idProfile: ID!
    $idClient: ID!
    $idProject: ID!
    $idSubproject: ID!
    $EntryDate: DateTime!
    $Description: String!
    $Todos: String!
  ) {
    updateJournal(
      idJournal: $idJournal
      journal: {
        idProfile: $idProfile
        idClient: $idClient
        idProject: $idProject
        idSubproject: $idSubproject
        EntryDate: $EntryDate
        Description: $Description
        Todos: $Todos
      }
    ) {
      idProfile
      idClient
      idProject
      idSubproject
      idJournal
      EntryDate
      Description
      Todos
    }
  }
`;
const DELETE_MUTATION = gql`
  mutation deleteMutation($idJournal: ID!) {
    deleteJournal(idJournal: $idJournal) {
      idJournal
      EntryDate
      Description
      Todos
    }
  }
`;

const EditJournal = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { loading: loadingProfile, Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { idJournal: idJournalParam } = useParams();
  const idJournalParamInt = idJournalParam ? (Number.isNaN(parseInt(idJournalParam)) ? -1 : parseInt(idJournalParam)) : -1;

  const {
    loading,
    idProfile: idProfileEdit,
    idClient: idClientEdit,
    idProject: idProjectEdit,
    idSubproject: idSubprojectEdit,
    idJournal: idJournalEdit,
    EntryDate: EntryDateEdit,
    Description: DescriptionEdit,
    Todos: TodosEdit,
  } = useGetJournal(idJournalParamInt);
  const { input, isErrorInput, isLoading } = useSelector((store) => store.journal);

  const { loading: loadingClientsList, list: clientsList } = useClientsList();
  const { loading: loadingProjectsList, list: projectsList } = useProjectsList();
  const { loading: loadingSubprojectsList, list: subprojectsList } = useSubprojectsList();

  const [updateRow, { loading: loadingUpdate, error: updateError }] = useMutation(UPDATE_MUTATION);
  const [deleteRow, { loading: loadingDelete, error: deleteError }] = useMutation(DELETE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.idClient && input.idClient !== "") {
      if (input.idProject && input.idProject !== "") {
        if (input.idSubproject && input.idSubproject !== "") {
          if (input.EntryDate && input.EntryDate !== "") {
            if (input.Description && input.Description !== "") {
              const EntryDateFormatted = new Date(input.EntryDate).toISOString();
              const result = await updateRow({
                variables: {
                  idJournal: idJournalParamInt,
                  idProfile: parseInt(input.idProfile),
                  idClient: parseInt(input.idClient),
                  idProject: parseInt(input.idProject),
                  idSubproject: parseInt(input.idSubproject),
                  EntryDate: EntryDateFormatted,
                  Description: input.Description,
                  Todos: input.Todos,
                },
              });
              if (!result?.errors) {
                dispatch(clearValues());
                navigate("/journals");
              }
            } else dispatch(setErrorInput({ name: "Description" }));
          } else dispatch(setErrorInput({ name: "EntryDate" }));
        } else dispatch(setErrorInput({ name: "idSubproject" }));
      } else dispatch(setErrorInput({ name: "idProject" }));
    } else dispatch(setErrorInput({ name: "idClient" }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await deleteRow({
      variables: {
        idJournal: idJournalParamInt,
      },
    });
    if (!result.errors) {
      dispatch(clearValues());
      navigate("/journals");
    }
  };

  useEffect(() => {
    if (parseInt(idJournalEdit) !== -1) {
      const EntryDateFormatted = EntryDateEdit ? moment(new Date(EntryDateEdit)).format("YYYY-MM-DD") : "";
      dispatch(
        setEdit({
          editId: idJournalEdit || "",
          input: {
            idProfile: idProfileEdit || "",
            idClient: idClientEdit || "",
            idProject: idProjectEdit || "",
            idSubproject: idSubprojectEdit || "",
            idJournal: idJournalEdit || "",
            EntryDate: EntryDateFormatted || "",
            Description: DescriptionEdit || "",
            Todos: TodosEdit || "",
          },
        })
      );
    }
    // eslint-disable-next-line
  }, [idJournalEdit]);

  if (!isMounted) return <></>;
  if (isLoading || loading || loadingProfile || loadingClientsList || loadingProjectsList || loadingSubprojectsList || loadingUpdate || loadingDelete)
    return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Paper elevation={2}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
        <Typography variant="h6" gutterBottom component="div">
          Edit Journal Entry - {moment(input.EntryDate).format("DD/MM/YYYY")}
        </Typography>
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
          {clientsList.length > 0 && (
            <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
              <InputLabel error={isErrorInput.idClient}>Client</InputLabel>
              <TextField
                error={isErrorInput.idClient}
                size="small"
                margin="dense"
                id="idClient"
                value={input.idClient}
                onChange={(e) => dispatch(setInput({ name: "idClient", value: e.target.value }))}
                required
                variant="outlined"
                select
              >
                {clientsList.map((item) => {
                  return (
                    <MenuItem key={item.idClient} value={item.idClient}>
                      {item.Name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Stack>
          )}
          {projectsList.length > 0 && (
            <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
              <InputLabel error={isErrorInput.idProject}>Project</InputLabel>
              <TextField
                error={isErrorInput.idProject}
                size="small"
                margin="dense"
                id="idProject"
                value={input.idProject}
                onChange={(e) => dispatch(setInput({ name: "idProject", value: e.target.value }))}
                required
                variant="outlined"
                select
              >
                {projectsList.map((item) => {
                  return (
                    <MenuItem key={item.idProject} value={item.idProject}>
                      {item.Name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Stack>
          )}
          {subprojectsList.length > 0 && (
            <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
              <InputLabel error={isErrorInput.idSubproject}>Subproject</InputLabel>
              <TextField
                error={isErrorInput.idSubproject}
                size="small"
                margin="dense"
                id="idSubproject"
                value={input.idSubproject}
                onChange={(e) => dispatch(setInput({ name: "idSubproject", value: e.target.value }))}
                required
                variant="outlined"
                select
              >
                {subprojectsList.map((item) => {
                  return (
                    <MenuItem key={item.idSubproject} value={item.idSubproject}>
                      {item.Name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Stack>
          )}
        </Stack>
        <InputLabel error={isErrorInput.Description}>Description</InputLabel>
        <TextareaAutosize
          autoFocus
          size="small"
          margin="dense"
          id="Description"
          label="Description"
          type="text"
          value={input.Description}
          onChange={(e) => dispatch(setInput({ name: "Description", value: e.target.value }))}
          required
          minRows={5}
          style={{ width: 300 }}
          variant="outlined"
        />
        <InputLabel error={isErrorInput.Todos}>To Do</InputLabel>
        <TextareaAutosize
          size="small"
          margin="dense"
          id="Todos"
          label="To do's"
          type="text"
          value={input.Todos}
          onChange={(e) => dispatch(setInput({ name: "Todos", value: e.target.value }))}
          minRows={5}
          style={{ width: 300 }}
          variant="outlined"
        />

        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
          <IconButton
            area-label="cancel"
            onClick={() => {
              dispatch(clearValues());
              navigate("/journals");
            }}
            size="small"
            color="primary"
          >
            <CancelIcon />
          </IconButton>
          <IconButton area-label="delete" onClick={handleDelete} disabled={isLoading} size="small" color="primary">
            <DeleteIcon />
          </IconButton>
          <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading} size="small" color="primary">
            <SaveIcon />
          </IconButton>
        </Stack>
        {updateError && <Typography color="error.main">{updateError?.message}</Typography>}
        {deleteError && <Typography color="error.main">{deleteError?.message}</Typography>}
      </Stack>
    </Paper>
  );
};

export default EditJournal;
