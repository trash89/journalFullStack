import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

import { useIsMounted } from "../../hooks";

import { handleChange, setErrorInput, clearValues } from "../../features/client/clientSlice";

const CURRENT_PROFILE_QUERY = gql`
  query editProfileQuery($idProfile: ID!) {
    profile(idProfile: $idProfile) {
      idProfile
      Username
      Is_Admin
    }
  }
`;
const CREATE_CLIENT_MUTATION = gql`
  mutation createClientMutation($Name: String!, $Description: String!, $StartDate: DateTime!, $EndDate: DateTime) {
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
  const idProfileConnected = parseInt(user.idProfile || -1);

  const { input, isErrorInput, isLoading } = useSelector((store) => store.client);

  const { data: currentProfile } = useQuery(CURRENT_PROFILE_QUERY, {
    variables: { idProfile: idProfileConnected },
  });
  const [createClient, { error: createClientError }] = useMutation(CREATE_CLIENT_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.Name && input.Name !== "") {
      if (input.Description && input.Description !== "") {
        if (input.StartDate && input.StartDate !== "") {
          const result = await createClient({
            variables: {
              Name: input.Name,
              Description: input.Description,
              StartDate: new Date(input.StartDate).toISOString(),
              EndDate: !input.EndDate || input.EndDate === "" ? null : new Date(input.EndDate).toISOString(),
            },
          });
          if (!result.errors) {
            dispatch(clearValues());
            toast.success(`Success creating new client !`);
            navigate("/clients");
          }
        } else dispatch(setErrorInput({ name: "StartDate" }));
      } else dispatch(setErrorInput({ name: "Description" }));
    } else dispatch(setErrorInput({ name: "Name" }));
  };

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
      <Typography variant="h6" gutterBottom component="div">
        New client, on profile {currentProfile?.profile?.Username}
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
        onChange={(e) => dispatch(handleChange({ name: "Name", value: e.target.value }))}
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
        onChange={(e) => dispatch(handleChange({ name: "Description", value: e.target.value }))}
        required
        variant="outlined"
      />
      <TextField
        error={isErrorInput.StartDate}
        size="small"
        margin="dense"
        id="StartDate"
        helperText="Start Date"
        type="date"
        value={input.StartDate}
        required
        onChange={(e) => dispatch(handleChange({ name: "StartDate", value: e.target.value }))}
        variant="outlined"
      />
      <TextField
        error={isErrorInput.EndDate}
        size="small"
        margin="dense"
        id="EndDate"
        helperText="End Date"
        type="date"
        value={input.EndDate}
        onChange={(e) => dispatch(handleChange({ name: "EndDate", value: e.target.value }))}
        variant="outlined"
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <IconButton area-label="cancel" onClick={() => navigate("/clients")}>
          <CancelIcon />
        </IconButton>
        <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading}>
          <SaveIcon />
        </IconButton>
      </Stack>
      {createClientError && <Typography color="error.main">{createClientError?.message}</Typography>}
    </Stack>
  );
};

export default NewClient;
