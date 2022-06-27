import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";

import { useIsMounted, useGetProfile, useClientsList } from "../../hooks";

import { setInput, setErrorInput, clearValues } from "../../features/project/projectSlice";

const CREATE_MUTATION = gql`
  mutation createMutation(
    $idClient: ID!
    $Name: String!
    $Description: String!
    $isDefault: String!
    $StartDate: DateTime!
    $EndDate: DateTime
    $Finished: String!
  ) {
    createProject(
      project: {
        idClient: $idClient
        Name: $Name
        Description: $Description
        isDefault: $isDefault
        StartDate: $StartDate
        EndDate: $EndDate
        Finished: $Finished
      }
    ) {
      idClient
      idProject
      Name
      Description
      isDefault
      StartDate
      EndDate
      Finished
    }
  }
`;

const NewProject = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { loading: loadingProfile, Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { loading: loadingClients, list: clientsList } = useClientsList();

  const { input, isErrorInput, isLoading } = useSelector((store) => store.project);

  const [createRow, { error: createError }] = useMutation(CREATE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.idClient && input.idClient !== "") {
      if (input.Name && input.Name !== "") {
        if (input.Description && input.Description !== "") {
          if (input.isDefault && input.isDefault !== "") {
            if (input.StartDate && input.StartDate !== "") {
              if (input.Finished && input.Finished !== "") {
                const StartDateFormatted = new Date(input.StartDate).toISOString();
                const EndDateFormatted = !input.EndDate || input.EndDate === "" ? null : new Date(input.EndDate).toISOString();
                const result = await createRow({
                  variables: {
                    idClient: input.idClient,
                    Name: input.Name,
                    Description: input.Description,
                    isDefault: input.isDefault,
                    StartDate: StartDateFormatted,
                    EndDate: EndDateFormatted,
                    Finished: input.Finished,
                  },
                });
                if (!result?.errors) {
                  dispatch(clearValues());
                  navigate("/projects");
                }
              } else dispatch(setErrorInput({ name: "Finished" }));
            } else dispatch(setErrorInput({ name: "StartDate" }));
          } else dispatch(setErrorInput({ name: "isDefault" }));
        } else dispatch(setErrorInput({ name: "Description" }));
      } else dispatch(setErrorInput({ name: "Name" }));
    } else dispatch(setErrorInput({ name: "idClient" }));
  };

  useEffect(() => {
    dispatch(clearValues());
    // eslint-disable-next-line
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || loadingClients || loadingProfile) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
      <Typography variant="h6" gutterBottom component="div">
        New project, on profile {UsernameConnected}
      </Typography>
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
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.Name}>Project Name</InputLabel>
          <TextField
            error={isErrorInput.Name}
            autoFocus
            size="small"
            margin="dense"
            id="Name"
            type="text"
            value={input.Name}
            onChange={(e) => dispatch(setInput({ name: "Name", value: e.target.value }))}
            required
            variant="outlined"
          />
        </Stack>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.isDefault}>Default?</InputLabel>
          <TextField
            error={isErrorInput.isDefault}
            size="small"
            margin="dense"
            id="isDefault"
            select
            value={input.isDefault}
            onChange={(e) => dispatch(setInput({ name: "isDefault", value: e.target.value }))}
            required
            variant="outlined"
          >
            <MenuItem key="N" value="N">
              No
            </MenuItem>
            <MenuItem key="Y" value="Y">
              Yes
            </MenuItem>
          </TextField>
        </Stack>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.Finished}>Finished?</InputLabel>
          <TextField
            error={isErrorInput.Finished}
            size="small"
            margin="dense"
            id="Finished"
            select
            value={input.Finished}
            onChange={(e) => dispatch(setInput({ name: "Finished", value: e.target.value }))}
            variant="outlined"
            required
          >
            <MenuItem key="N" value="N">
              No
            </MenuItem>
            <MenuItem key="Y" value="Y">
              Yes
            </MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <InputLabel error={isErrorInput.Description}>Description</InputLabel>
      <TextField
        error={isErrorInput.Description}
        size="small"
        margin="dense"
        id="Description"
        type="text"
        value={input.Description}
        onChange={(e) => dispatch(setInput({ name: "Description", value: e.target.value }))}
        required
        variant="outlined"
        fullWidth
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={0}>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.StartDate}>Start Date</InputLabel>
          <TextField
            error={isErrorInput.StartDate}
            size="small"
            margin="dense"
            id="StartDate"
            type="date"
            value={input.StartDate}
            onChange={(e) => dispatch(setInput({ name: "StartDate", value: e.target.value }))}
            variant="outlined"
            required
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
      </Stack>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <IconButton
          area-label="cancel"
          onClick={() => {
            dispatch(clearValues());
            navigate("/projects");
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

export default NewProject;
