import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { useIsMounted, useGetProfile, useGetProject, useClientsList } from "../../hooks";

import { setInput, setErrorInput, clearValues, setEdit } from "../../features/project/projectSlice";

import moment from "moment";

const UPDATE_MUTATION = gql`
  mutation updateMutation(
    $idProject: ID!
    $idClient: ID!
    $Name: String!
    $Description: String!
    $isDefault: String!
    $StartDate: DateTime!
    $EndDate: DateTime
    $Finished: String!
  ) {
    updateProject(
      idProject: $idProject
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
const DELETE_MUTATION = gql`
  mutation deleteMutation($idProject: ID!) {
    deleteProject(idProject: $idProject) {
      idProject
      Name
    }
  }
`;

const EditProject = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.user);
  const { Username: UsernameConnected } = useGetProfile(parseInt(user.idProfile));

  const { idProject: idProjectParam } = useParams();
  const idProjectParamInt = idProjectParam ? (Number.isNaN(parseInt(idProjectParam)) ? -1 : parseInt(idProjectParam)) : -1;

  const {
    idClient: idClientEdit,
    idProject: idProjectEdit,
    Name: NameEdit,
    Description: DescriptionEdit,
    isDefault: isDefaultEdit,
    StartDate: StartDateEdit,
    EndDate: EndDateEdit,
    Finished: FinishedEdit,
  } = useGetProject(idProjectParamInt);

  const { input, isErrorInput, isLoading } = useSelector((store) => store.project);

  const clientsList = useClientsList();

  const [updateRow, { error: updateError }] = useMutation(UPDATE_MUTATION);
  const [deleteRow, { error: deleteError }] = useMutation(DELETE_MUTATION);

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
                const result = await updateRow({
                  variables: {
                    idProject: idProjectParamInt,
                    idClient: parseInt(input.idClient),
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
                  toast.success(`Success updating the project !`);
                  navigate("/projects");
                }
              } else dispatch(setErrorInput({ name: "Finished" }));
            } else dispatch(setErrorInput({ name: "StartDate" }));
          } else dispatch(setErrorInput({ name: "isDefault" }));
        } else dispatch(setErrorInput({ name: "Description" }));
      } else dispatch(setErrorInput({ name: "Name" }));
    } else dispatch(setErrorInput({ name: "idClient" }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await deleteRow({
      variables: {
        idProject: idProjectParamInt,
      },
    });
    if (!result.errors) {
      dispatch(clearValues());
      toast.success("Success delete project !");
      navigate("/projects");
    }
  };

  useEffect(() => {
    if (idProjectEdit !== -1) {
      const StartDateFormatted = StartDateEdit ? moment(new Date(StartDateEdit)).format("YYYY-MM-DD") : "";
      const EndDateFormatted = EndDateEdit ? moment(new Date(EndDateEdit)).format("YYYY-MM-DD") : "";
      dispatch(
        setEdit({
          editId: idProjectEdit,
          input: {
            idClient: idClientEdit,
            Name: NameEdit,
            Description: DescriptionEdit,
            isDefault: isDefaultEdit,
            StartDate: StartDateFormatted,
            EndDate: EndDateFormatted,
            Finished: FinishedEdit,
          },
        })
      );
    }
  }, [idProjectEdit]);

  if (!isMounted) return <></>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} padding={1}>
      <Typography variant="h6" gutterBottom component="div">
        Edit project, on profile {UsernameConnected}
      </Typography>

      {clientsList.length > 0 && (
        <TextField
          error={isErrorInput.idClient}
          size="small"
          margin="dense"
          id="idClient"
          helperText="Client?"
          value={input.idClient}
          onChange={(e) => dispatch(setInput({ name: "idClient", value: e.target.value }))}
          required
          variant="standard"
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
      )}
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <TextField
          error={isErrorInput.Name}
          autoFocus
          size="small"
          margin="dense"
          id="Name"
          label="Project Name"
          type="text"
          value={input.Name}
          onChange={(e) => dispatch(setInput({ name: "Name", value: e.target.value }))}
          required
          variant="standard"
        />
        <TextField
          error={isErrorInput.isDefault}
          size="small"
          margin="dense"
          id="isDefault"
          helperText="Default?"
          select
          value={input.isDefault}
          onChange={(e) => dispatch(setInput({ name: "isDefault", value: e.target.value }))}
          required
          variant="standard"
        >
          <MenuItem key="N" value="N">
            No
          </MenuItem>
          <MenuItem key="Y" value="Y">
            Yes
          </MenuItem>
        </TextField>
        <TextField
          error={isErrorInput.Finished}
          size="small"
          margin="dense"
          id="Finished"
          helperText="Finished?"
          select
          value={input.Finished}
          onChange={(e) => dispatch(setInput({ name: "Finished", value: e.target.value }))}
          variant="standard"
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
        variant="standard"
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
        onChange={(e) => dispatch(setInput({ name: "StartDate", value: e.target.value }))}
        variant="standard"
      />
      <TextField
        error={isErrorInput.EndDate}
        size="small"
        margin="dense"
        id="EndDate"
        helperText="End Date"
        type="date"
        value={input.EndDate}
        onChange={(e) => dispatch(setInput({ name: "EndDate", value: e.target.value }))}
        variant="standard"
      />
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

export default EditProject;
