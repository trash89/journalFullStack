import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import { useIsMounted, useGetProfile } from "../../hooks";

import { setInput, setErrorInput, clearValues } from "../../features/client/clientSlice";

const CREATE_MUTATION = gql`
  mutation createMutation($Name: String!, $Description: String!, $StartDate: DateTime!, $EndDate: DateTime) {
    createClient(client: { Name: $Name, Description: $Description, StartDate: $StartDate, EndDate: $EndDate }) {
      idProfile
      idClient
      Name
      Description
      StartDate
      EndDate
    }
  }
`;

const NewClient = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { loading: loadingProfile, Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { input, isErrorInput, isLoading } = useSelector((store) => store.client);

  const [createRow, { loading: loadingCreate, error: createError }] = useMutation(CREATE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.Name && input.Name !== "") {
      if (input.Description && input.Description !== "") {
        if (input.StartDate && input.StartDate !== "") {
          const StartDateFormatted = new Date(input.StartDate).toISOString();
          const EndDateFormatted = !input.EndDate || input.EndDate === "" ? null : new Date(input.EndDate).toISOString();
          const result = await createRow({
            variables: {
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

  useEffect(() => {
    dispatch(clearValues());
    // eslint-disable-next-line
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || loadingProfile || loadingCreate) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Paper elevation={2}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
        <Typography variant="h6" gutterBottom component="div">
          New client
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
          variant="outlined"
          fullWidth
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
          <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading} size="small" color="primary">
            <SaveIcon />
          </IconButton>
        </Stack>
        {createError && <Typography color="error.main">{createError?.message}</Typography>}
      </Stack>
    </Paper>
  );
};

export default NewClient;
