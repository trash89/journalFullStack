import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import { useIsMounted, useGetProfile, useClientsList, useProjectsList } from "../../hooks";

import { setInput, setErrorInput, clearValues } from "../../features/subproject/subprojectSlice";

const CREATE_MUTATION = gql`
  mutation createMutation(
    $idProject: ID!
    $idClient: ID!
    $Name: String!
    $Description: String!
    $isDefault: String!
    $StartDate: DateTime!
    $EndDate: DateTime
    $Finished: String!
  ) {
    createSubproject(
      subproject: {
        idProject: $idProject
        idClient: $idClient
        Name: $Name
        Description: $Description
        isDefault: $isDefault
        StartDate: $StartDate
        EndDate: $EndDate
        Finished: $Finished
      }
    ) {
      idProject
      idClient
      idSubproject
      Name
      Description
      isDefault
      StartDate
      EndDate
      Finished
    }
  }
`;

const NewSubproject = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);

  const { loading: loadingClients, list: clientsList } = useClientsList();
  const { loading: loadingProjects, list: projectsList } = useProjectsList();

  const { input, isErrorInput, isLoading } = useSelector((store) => store.subproject);

  const [createRow, { loading: loadingCreate, error: createError }] = useMutation(CREATE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.idProject && input.idProject !== "") {
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
                      idProject: input.idProject,
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
                    navigate("/subprojects");
                  }
                } else dispatch(setErrorInput({ name: "Finished" }));
              } else dispatch(setErrorInput({ name: "StartDate" }));
            } else dispatch(setErrorInput({ name: "isDefault" }));
          } else dispatch(setErrorInput({ name: "Description" }));
        } else dispatch(setErrorInput({ name: "Name" }));
      } else dispatch(setErrorInput({ name: "idClient" }));
    } else dispatch(setErrorInput({ name: "idProject" }));
  };

  useEffect(() => {
    dispatch(clearValues());
    // eslint-disable-next-line
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || loadingClients || loadingProjects || loadingCreate) return <CircularProgress />;
  if (!user) {
    return <Navigate to="/register" />;
  }

  return (
    <Paper elevation={2}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
        <Typography variant="h6" gutterBottom component="div">
          New subproject
        </Typography>
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={0}>
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
        </Stack>
        <InputLabel error={isErrorInput.Name}>Subproject Name</InputLabel>
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

        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
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
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
          <IconButton
            area-label="cancel"
            onClick={() => {
              dispatch(clearValues());
              navigate("/subprojects");
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

export default NewSubproject;
