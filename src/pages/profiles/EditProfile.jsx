import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import { logoutUser } from "../../features/user/userSlice";
import { useIsMounted, useGetProfile, useProfilesArray } from "../../hooks";

const UPDATE_MUTATION = gql`
  mutation updateMutation($idProfile: ID!, $Username: String!, $Password: String!, $Keep: String!) {
    updateProfile(idProfile: $idProfile, profile: { Username: $Username, Password: $Password, Keep: $Keep }) {
      idProfile
      Username
      Keep
    }
  }
`;
const DELETE_MUTATION = gql`
  mutation deleteMutation($idProfile: ID!) {
    deleteProfile(idProfile: $idProfile) {
      idProfile
      Username
      Keep
    }
  }
`;

const isIdInList = (id, list) => (list ? list.includes(id) : false);

const EditProfile = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.user);
  const { loading: loadingProfileConnected, idProfile: idProfileConnected, Is_Admin: Is_AdminConnected } = useGetProfile(parseInt(user.idProfile));

  const { idProfile: idProfileParam } = useParams();
  const idProfileParamInt = idProfileParam ? (Number.isNaN(parseInt(idProfileParam)) ? -1 : parseInt(idProfileParam)) : -1;
  const { loading: loadingProfileEdit, idProfile: idProfileEdit, Username: UsernameEdit, Keep: KeepEdit } = useGetProfile(idProfileParamInt);

  const { loading: loadingProfiles, list: profilesArray } = useProfilesArray();

  const isProfileInList = isIdInList(idProfileParam, profilesArray);

  const [input, setInput] = useState({ Password: "", Keep: KeepEdit });
  const [isErrorInput, setIsErrorInput] = useState({
    Password: false,
    Keep: false,
  });

  const [updateProfile, { loading: loadingUpdate, error: updateError }] = useMutation(UPDATE_MUTATION);
  const [deleteProfile, { loading: loadingDelete, error: deleteError }] = useMutation(DELETE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Password } = input;
    if (!Password) {
      setIsErrorInput({ ...isErrorInput, Password: true });
      return;
    }
    const result = await updateProfile({
      variables: {
        idProfile: parseInt(idProfileEdit),
        Username: UsernameEdit,
        Password: input.Password,
        Keep: input.Keep,
      },
    });
    if (!result.errors) {
      if (idProfileEdit === idProfileConnected) {
        dispatch(logoutUser());
        navigate("/register");
      } else {
        navigate("/profiles");
      }
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const result = await deleteProfile({
      variables: {
        idProfile: parseInt(idProfileEdit),
      },
    });
    if (!result.errors) {
      navigate("/profiles");
    }
  };

  const handlePassword = (e) => {
    setInput({ ...input, Password: e.target.value });
    if (isErrorInput.Password) setIsErrorInput({ ...isErrorInput, Password: false });
  };
  const handleKeep = (e) => {
    setInput({ ...input, Keep: e.target.value });
    if (isErrorInput.Keep) setIsErrorInput({ ...isErrorInput, Keep: false });
  };

  if (!isMounted) return <></>;
  if (loadingProfileConnected || loadingProfileEdit || loadingProfiles || isLoading || loadingUpdate || loadingDelete) return <CircularProgress />;
  if (!isProfileInList || idProfileParamInt === -1) return <>You cannot update this profile</>;

  return (
    <Paper elevation={2}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" padding={1} spacing={1}>
        <Typography>Username : {UsernameEdit}</Typography>
        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={0} padding={0}>
          <InputLabel error={isErrorInput.Password}>New Password?</InputLabel>
          <TextField
            autoFocus
            error={isErrorInput.Password}
            margin="dense"
            size="small"
            id="Password"
            type="password"
            value={input.Password}
            required
            onChange={handlePassword}
            variant="outlined"
          />
          <InputLabel error={isErrorInput.Keep}>Keep?</InputLabel>
          <TextField
            error={isErrorInput.Keep}
            size="small"
            margin="dense"
            id="isDefault"
            select
            value={input.Keep}
            onChange={handleKeep}
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
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
          <IconButton area-label="cancel" onClick={() => navigate("/profiles")} size="small" color="primary">
            <CancelIcon />
          </IconButton>
          {Is_AdminConnected === "Y" && idProfileEdit !== idProfileConnected && (
            <IconButton area-label="delete" onClick={handleDelete} disabled={isLoading} size="small" color="primary">
              <DeleteIcon />
            </IconButton>
          )}
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

export default EditProfile;
