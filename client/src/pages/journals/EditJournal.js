import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

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
    $ThingsDone: String
    $DocUploaded: ByteArray
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
        ThingsDone: $ThingsDone
        DocUploaded: $DocUploaded
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
      ThingsDone
      DocUploaded
    }
  }
`;
const DELETE_MUTATION = gql`
  mutation deleteMutation($idJournal: ID!) {
    deleteJournal(idJournal: $idJournal) {
      idJournal
      EntryDate
    }
  }
`;

const EditJournal = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { idJournal: idJournalParam } = useParams();
  const idJournalParamInt = idJournalParam ? (Number.isNaN(parseInt(idJournalParam)) ? -1 : parseInt(idJournalParam)) : -1;

  const {
    idProfile: idProfileEdit,
    idClient: idClientEdit,
    idProject: idProjectEdit,
    idSubproject: idSubprojectEdit,
    idJournal: idJournalEdit,
    EntryDate: EntryDateEdit,
    Description: DescriptionEdit,
    Todos: TodosEdit,
    ThingsDone: ThingsDoneEdit,
    DocUploaded: DocUploadedEdit,
  } = useGetJournal(idJournalParamInt);
  const { input, isErrorInput, isLoading } = useSelector((store) => store.journal);

  const clientsList = useClientsList();
  const projectsList = useProjectsList();
  const subprojectsList = useSubprojectsList();

  const [updateRow, { error: updateError }] = useMutation(UPDATE_MUTATION);
  const [deleteRow, { error: deleteError }] = useMutation(DELETE_MUTATION);

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
                  ThingsDone: input.ThingsDone,
                  //DocUploaded: input.DocUploaded,
                  DocUploaded: null,
                },
              });
              if (!result?.errors) {
                dispatch(clearValues());
                toast.success(`Success updating the subproject !`);
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
      toast.success("Success delete journal entry !");
      navigate("/journals");
    }
  };

  useEffect(() => {
    if (parseInt(idJournalEdit) !== -1) {
      const EntryDateFormatted = EntryDateEdit ? moment(new Date(EntryDateEdit)).format("YYYY-MM-DD") : "";
      dispatch(
        setEdit({
          editId: idJournalEdit,
          input: {
            idProfile: idProfileEdit,
            idClient: idClientEdit,
            idProject: idProjectEdit,
            idSubproject: idSubprojectEdit,
            idJournal: idJournalEdit,
            EntryDate: EntryDateFormatted,
            Description: DescriptionEdit,
            Todos: TodosEdit,
            ThingsDone: ThingsDoneEdit,
            DocUploaded: DocUploadedEdit,
          },
        })
      );
    }
  }, [idJournalEdit]);

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
      <Typography variant="h6" gutterBottom component="div">
        Edit Journal Entry on {moment(input.EntryDate).format("DD/MM/YYYY")}, profile {UsernameConnected}
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
        style={{ width: 600 }}
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
        style={{ width: 600 }}
        variant="outlined"
      />
      <InputLabel error={isErrorInput.ThingsDone}>Already Done</InputLabel>
      <TextareaAutosize
        size="small"
        margin="dense"
        id="ThingsDone"
        label="Things Done"
        type="text"
        value={input.ThingsDone}
        onChange={(e) => dispatch(setInput({ name: "ThingsDone", value: e.target.value }))}
        minRows={5}
        style={{ width: 600 }}
        variant="outlined"
      />
      <InputLabel error={isErrorInput.DocUploaded}>Uploading Document</InputLabel>
      <TextField
        error={isErrorInput.DocUploaded}
        size="small"
        margin="dense"
        id="DocUploaded"
        label="Uploading Document"
        type="text"
        value={input.DocUploaded}
        onChange={(e) => dispatch(setInput({ name: "DocUploaded", value: e.target.value }))}
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
        >
          <CancelIcon />
        </IconButton>
        <IconButton area-label="delete" onClick={handleDelete} disabled={isLoading} size="small">
          <DeleteIcon />
        </IconButton>
        <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading} size="small">
          <SaveIcon />
        </IconButton>
      </Stack>
      {updateError && <Typography color="error.main">{updateError?.message}</Typography>}
      {deleteError && <Typography color="error.main">{deleteError?.message}</Typography>}
    </Stack>
  );
};

export default EditJournal;
