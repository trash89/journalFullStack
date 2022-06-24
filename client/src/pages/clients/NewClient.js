import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import { logoutUser } from "../../features/user/userSlice";
import { useIsMounted, useIsAdmin } from "../../hooks";
import moment from "moment";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const idProfileConnected = parseInt(user.idProfile || -1);

  const { data: currentProfile } = useQuery(CURRENT_PROFILE_QUERY, {
    variables: { idProfile: idProfileConnected },
  });
  const [createClient, { error: createClientError }] = useMutation(CREATE_CLIENT_MUTATION);

  const [input, setInput] = useState({
    Name: "",
    Description: "",
    StartDate: new moment().format("YYYY-MM-DD"),
    EndDate: "",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    Name: false,
    Description: false,
    StartDate: false,
    EndDate: false,
  });

  const handleInputName = (e) => {
    setInput({ ...input, Name: e.target.value });
    if (isErrorInput.Name) setIsErrorInput({ ...isErrorInput, Name: false });
  };
  const handleInputDescription = (e) => {
    setInput({ ...input, Description: e.target.value });
    if (isErrorInput.Description) setIsErrorInput({ ...isErrorInput, Description: false });
  };
  const handleInputStartDate = (e) => {
    setInput({ ...input, StartDate: e.target.value });
    if (isErrorInput.StartDate) setIsErrorInput({ ...isErrorInput, StartDate: false });
  };
  const handleInputEndDate = (e) => {
    setInput({ ...input, EndDate: e.target.value });
    if (isErrorInput.EndDate) setIsErrorInput({ ...isErrorInput, EndDate: false });
  };

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
            toast.success(`Success creating new client  !`);
            navigate("/clients");
          }
        } else setIsErrorInput({ ...isErrorInput, StartDate: true });
      } else setIsErrorInput({ ...isErrorInput, Description: true });
    } else setIsErrorInput({ ...isErrorInput, Name: true });
  };

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
      <Typography>Profile : {currentProfile?.profile?.Username}</Typography>
      <TextField
        error={isErrorInput.Name}
        autoFocus
        size="small"
        margin="dense"
        id="Name"
        label="Client Name"
        type="text"
        value={input.Name}
        onChange={handleInputName}
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
        onChange={handleInputDescription}
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
        onChange={handleInputStartDate}
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
        onChange={handleInputEndDate}
        variant="outlined"
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            navigate("/clients");
          }}
        >
          cancel
        </Button>
        <Button variant="outlined" size="small" onClick={handleSubmit}>
          save
        </Button>
      </Stack>
      {createClientError && <Typography color="error.main">{createClientError?.message}</Typography>}
    </Stack>
  );
};

export default NewClient;
