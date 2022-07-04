import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";

import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

import { useIsMounted, useGetProfile, useClientsList, useProjectsList, useSubprojectsList } from "../../hooks";

import { setInput, setErrorInput, clearValues } from "../../features/journal/journalSlice";

const CREATE_MUTATION = gql`
  mutation createMutation(
    $idProfile: ID!
    $idClient: ID!
    $idProject: ID!
    $idSubproject: ID!
    $EntryDate: DateTime!
    $Description: String!
    $Todos: String!
    $ThingsDone: String!
  ) {
    createJournal(
      journal: {
        idProfile: $idProfile
        idClient: $idClient
        idProject: $idProject
        idSubproject: $idSubproject
        EntryDate: $EntryDate
        Description: $Description
        Todos: $Todos
        ThingsDone: $ThingsDone
      }
    ) {
      idProfile
      idClient
      idProject
      idSubproject
      idJournal
      createdAt
      updatedAt
      EntryDate
      Description
      Todos
      ThingsDone
    }
  }
`;

const NewJournal = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { loading: loadingProfile, idProfile: idProfileConnected, Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { loading: loadingClientsList, list: clientsList } = useClientsList();
  const { loading: loadingProjectsList, list: projectsList } = useProjectsList();
  const { loading: loadingSubprojectsList, list: subprojectsList } = useSubprojectsList();

  const { input, isErrorInput, isLoading } = useSelector((store) => store.journal);

  const [createRow, { loading: loadingCreate, error: createError }] = useMutation(CREATE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.idClient && input.idClient !== "") {
      if (input.idProject && input.idProject !== "") {
        if (input.idSubproject && input.idSubproject !== "") {
          if (input.EntryDate && input.EntryDate !== "") {
            if (input.Description && input.Description !== "") {
              const EntryDateFormatted = new Date(input.EntryDate).toISOString();
              const result = await createRow({
                variables: {
                  idProfile: parseInt(idProfileConnected),
                  idClient: input.idClient,
                  idProject: input.idProject,
                  idSubproject: input.idSubproject,
                  EntryDate: EntryDateFormatted,
                  Description: input.Description,
                  Todos: input.Todos,
                  ThingsDone: input.ThingsDone,
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

  useEffect(() => {
    dispatch(clearValues());
    // eslint-disable-next-line
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || loadingProfile || loadingClientsList || loadingProjectsList || loadingSubprojectsList || loadingCreate) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
      <Typography variant="h6" gutterBottom component="div">
        New journal entry, on profile {UsernameConnected}
      </Typography>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
        <InputLabel error={isErrorInput.EntryDate}>Entry Date</InputLabel>
        <TextField
          autoFocus
          error={isErrorInput.EntryDate}
          size="small"
          margin="dense"
          id="EntryDate"
          type="date"
          value={input.EntryDate}
          onChange={(e) => dispatch(setInput({ name: "EntryDate", value: e.target.value }))}
          variant="outlined"
          required
        />
      </Stack>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={1} spacing={1}>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.idClient}>Client</InputLabel>
          <TextField
            error={isErrorInput.idClient}
            size="small"
            margin="dense"
            id="idClient"
            select
            value={input.idClient}
            onChange={(e) => dispatch(setInput({ name: "idClient", value: e.target.value }))}
            required
            variant="outlined"
          >
            {clientsList?.map((item) => {
              return (
                <MenuItem key={item.idClient} value={item.idClient}>
                  {item.Name}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.idProject}>Project</InputLabel>
          <TextField
            error={isErrorInput.idProject}
            size="small"
            margin="dense"
            id="idProject"
            select
            value={input.idProject}
            onChange={(e) => dispatch(setInput({ name: "idProject", value: e.target.value }))}
            required
            variant="outlined"
          >
            {projectsList?.map((item) => {
              return (
                <MenuItem key={item.idProject} value={item.idProject}>
                  {item.Name}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.idSubproject}>Subproject</InputLabel>
          <TextField
            error={isErrorInput.idSubproject}
            size="small"
            margin="dense"
            id="idSubproject"
            select
            value={input.idSubproject}
            onChange={(e) => dispatch(setInput({ name: "idSubproject", value: e.target.value }))}
            required
            variant="outlined"
          >
            {subprojectsList?.map((item) => {
              return (
                <MenuItem key={item.idSubproject} value={item.idSubproject}>
                  {item.Name}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
      </Stack>
      <InputLabel error={isErrorInput.Description}>Description</InputLabel>
      <TextareaAutosize
        size="small"
        margin="dense"
        id="Description"
        type="text"
        value={input.Description}
        onChange={(e) => dispatch(setInput({ name: "Description", value: e.target.value }))}
        required
        variant="outlined"
        minRows={5}
        style={{ width: 600 }}
      />
      <InputLabel error={isErrorInput.Todos}>To Do</InputLabel>
      <TextareaAutosize
        size="small"
        margin="dense"
        id="Todos"
        type="text"
        value={input.Todos}
        onChange={(e) => dispatch(setInput({ name: "Todos", value: e.target.value }))}
        variant="outlined"
        minRows={5}
        style={{ width: 600 }}
      />
      <InputLabel error={isErrorInput.ThingsDone}>Already Done</InputLabel>
      <TextareaAutosize
        size="small"
        margin="dense"
        id="ThingsDone"
        value={input.ThingsDone}
        onChange={(e) => dispatch(setInput({ name: "ThingsDone", value: e.target.value }))}
        variant="outlined"
        minRows={5}
        style={{ width: 600 }}
      />

      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <IconButton
          area-label="cancel"
          onClick={() => {
            dispatch(clearValues());
            navigate("/journals");
          }}
          size="small"
        >
          <CancelIcon />
        </IconButton>
        <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading} size="small">
          <SaveIcon />
        </IconButton>
      </Stack>
      {createError && <Typography color="error.main">{createError?.message}</Typography>}
    </Stack>
  );
};

export default NewJournal;
