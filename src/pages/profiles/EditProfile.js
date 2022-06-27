import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { logoutUser } from "../../features/user/userSlice";
import { useIsMounted, useGetProfile, useProfilesArray } from "../../hooks";

const UPDATE_MUTATION = gql`
  mutation updateMutation($idProfile: ID!, $Username: String!, $Password: String!) {
    updateProfile(idProfile: $idProfile, profile: { Username: $Username, Password: $Password }) {
      idProfile
      Username
    }
  }
`;
const DELETE_MUTATION = gql`
  mutation deleteMutation($idProfile: ID!) {
    deleteProfile(idProfile: $idProfile) {
      idProfile
      Username
    }
  }
`;

const isIdInList = (id, list) => (list ? list.includes(id) : false);

const EditProfile = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.user);
  const { idProfile: idProfileConnected, Is_Admin: Is_AdminConnected } = useGetProfile(parseInt(user.idProfile));

  const { idProfile: idProfileParam } = useParams();
  const idProfileParamInt = idProfileParam ? (Number.isNaN(parseInt(idProfileParam)) ? -1 : parseInt(idProfileParam)) : -1;
  const { idProfile: idProfileEdit, Username: UsernameEdit } = useGetProfile(idProfileParamInt);

  const profilesArray = useProfilesArray();

  const isProfileInList = isIdInList(idProfileParam, profilesArray);

  const [input, setInput] = useState({ Password: "" });
  const [isErrorInput, setIsErrorInput] = useState({ Password: false });

  const [updateProfile, { error: updateError }] = useMutation(UPDATE_MUTATION);
  const [deleteProfile, { error: deleteError }] = useMutation(DELETE_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Password } = input;
    if (!Password) {
      setIsErrorInput({ ...isErrorInput, Password: true });
      toast.error("please fill out all fields");
      return;
    }
    const result = await updateProfile({
      variables: {
        idProfile: parseInt(idProfileEdit),
        Username: UsernameEdit,
        Password: input.Password,
      },
    });
    if (!result.errors) {
      if (idProfileEdit === idProfileConnected) {
        dispatch(logoutUser());
        toast.success(`Success, please reconnect !`);
        navigate("/register");
      } else {
        toast.success(`Success saving profile !`);
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
      toast.success("Success !");
      navigate("/profiles");
    }
  };

  const handlePassword = (e) => {
    setInput({ ...input, Password: e.target.value });
    if (isErrorInput.Password) setIsErrorInput({ ...isErrorInput, Password: false });
  };

  if (!isMounted) return <></>;
  if (!isProfileInList || idProfileParamInt === -1) return <>You cannot update this profile</>;
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
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
      </Stack>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <IconButton area-label="cancel" onClick={() => navigate("/profiles")} size="small">
          <CancelIcon />
        </IconButton>
        {Is_AdminConnected === "Y" && idProfileEdit !== idProfileConnected && (
          <IconButton area-label="delete" onClick={handleDelete} disabled={isLoading} size="small">
            <DeleteIcon />
          </IconButton>
        )}
        <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading} size="small">
          <SaveIcon />
        </IconButton>
      </Stack>
      {updateError && <Typography color="error.main">{updateError?.message}</Typography>}
      {deleteError && <Typography color="error.main">{deleteError?.message}</Typography>}
    </Stack>
  );
};

export default EditProfile;
