import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import { useIsMounted, useGetProfile, useGetClient } from "../../hooks";

import { setInput, setErrorInput, clearValues, setEdit } from "../../features/client/clientSlice";

import moment from "moment";

const UPDATE_MUTATION = gql`
  mutation updateMutation($idClient: ID!, $Name: String!, $Description: String!, $StartDate: DateTime!, $EndDate: DateTime) {
    updateClient(idClient: $idClient, client: { Name: $Name, Description: $Description, StartDate: $StartDate, EndDate: $EndDate }) {
      idProfile
      idClient
      Name
      Description
      StartDate
      EndDate
    }
  }
`;
const DELETE_MUTATION = gql`
  mutation deleteMutation($idClient: ID!) {
    deleteClient(idClient: $idClient) {
      idClient
      Name
    }
  }
`;

const EditClient = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { loading: loadingProfile, Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { idClient: idClientParam } = useParams();
  const idClientParamInt = idClientParam ? (Number.isNaN(parseInt(idClientParam)) ? -1 : parseInt(idClientParam)) : -1;

  const {
    loading,
    idClient: idClientEdit,
    Name: NameEdit,
    Description: DescriptionEdit,
    StartDate: StartDateEdit,
    EndDate: EndDateEdit,
  } = useGetClient(idClientParamInt);
  const { input, isErrorInput, isLoading } = useSelector((store) => store.client);

  const [updateRow, { loading: loadingUpdate, error: updateError }] = useMutation(UPDATE_MUTATION);
  const [deleteRow, { loading: loadingDelete, error: deleteError }] = useMutation(DELETE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.Name && input.Name !== "") {
      if (input.Description && input.Description !== "") {
        if (input.StartDate && input.StartDate !== "") {
          const StartDateFormatted = new Date(input.StartDate).toISOString();
          const EndDateFormatted = !input.EndDate || input.EndDate === "" ? null : new Date(input.EndDate).toISOString();
          const result = await updateRow({
            variables: {
              idClient: idClientParamInt,
              Name: input.Name,
              Description: input.Description,
              StartDate: StartDateFormatted,
              EndDate: EndDateFormatted,
            },
          });
          if (!result?.errors) {
            dispatch(clearValues());
            navigate("/clients");
          }
        } else dispatch(setErrorInput({ name: "StartDate" }));
      } else dispatch(setErrorInput({ name: "Description" }));
    } else dispatch(setErrorInput({ name: "Name" }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await deleteRow({
      variables: {
        idClient: idClientParamInt,
      },
    });
    if (!result.errors) {
      dispatch(clearValues());
      navigate("/clients");
    }
  };

  useEffect(() => {
    if (parseInt(idClientEdit) !== -1) {
      const StartDateFormatted = StartDateEdit ? moment(new Date(StartDateEdit)).format("YYYY-MM-DD") : "";
      const EndDateFormatted = EndDateEdit ? moment(new Date(EndDateEdit)).format("YYYY-MM-DD") : "";
      dispatch(
        setEdit({
          editId: idClientEdit || "",
          input: {
            Name: NameEdit || "",
            Description: DescriptionEdit || "",
            StartDate: StartDateFormatted || "",
            EndDate: EndDateFormatted || "",
          },
        })
      );
    }
    // eslint-disable-next-line
  }, [idClientEdit]);

  if (!isMounted) return <></>;
  if (isLoading || loading || loadingProfile || loadingUpdate || loadingDelete) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <Paper elevation={2}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
        <Typography variant="h6" gutterBottom component="div">
          Edit client
        </Typography>

        <TextField
          error={isErrorInput.Name}
          autoFocus
          size="small"
          margin="dense"
          id="Name"
          label="Client Name"
          type="text"
          value={input.Name}
          onChange={(e) => dispatch(setInput({ name: "Name", value: e.target.value }))}
          required
          variant="outlined"
        />
        <TextField
          error={isErrorInput.Description}
          size="small"
          margin="dense"
          id="Description"
          label="Client Description"
          type="text"
          value={input.Description}
          onChange={(e) => dispatch(setInput({ name: "Description", value: e.target.value }))}
          required
          fullWidth
          variant="outlined"
        />
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.StartDate}>Start Date</InputLabel>
          <TextField
            error={isErrorInput.StartDate}
            size="small"
            margin="dense"
            id="StartDate"
            type="date"
            value={input.StartDate}
            required
            onChange={(e) => dispatch(setInput({ name: "StartDate", value: e.target.value }))}
            variant="outlined"
          />
        </Stack>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.EndDate}>End Date</InputLabel>
          <TextField
            error={isErrorInput.EndDate}
            size="small"
            margin="dense"
            id="EndDate"
            type="date"
            value={input.EndDate}
            onChange={(e) => dispatch(setInput({ name: "EndDate", value: e.target.value }))}
            variant="outlined"
          />
        </Stack>
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
          <IconButton
            area-label="cancel"
            onClick={() => {
              dispatch(clearValues());
              navigate("/clients");
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

export default EditClient;
