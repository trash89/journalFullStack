import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import { logoutUser } from "../../features/user/userSlice";
import { useIsMounted, useIsAdmin } from "../../hooks";

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

const PROFILES_QUERY = gql`
  query profilesQuery {
    profiles {
      count
      list {
        idProfile
        Username
        Is_Admin
      }
    }
  }
`;

const EDIT_PROFILE_QUERY = gql`
  query editProfileQuery($idProfile: ID!) {
    profile(idProfile: $idProfile) {
      idProfile
      Username
      Is_Admin
    }
  }
`;

const isIdInList = (id, list) => (list ? list.includes(id) : false);

const EditProfile = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.user);
  const idProfileConnected = parseInt(user.idProfile || -1);
  const isAdmin = useIsAdmin(idProfileConnected);

  const { idProfile } = useParams();
  const idProfileInt = idProfile ? (parseInt(idProfile) === NaN ? -1 : parseInt(idProfile)) : -1;

  const { data: profilesList } = useQuery(PROFILES_QUERY);
  const profilesArray = profilesList?.profiles?.list?.map((profile) => profile?.idProfile);

  const isProfileInList = isIdInList(idProfile, profilesArray);

  const { data: editProfile } = useQuery(EDIT_PROFILE_QUERY, {
    variables: { idProfile: idProfileInt },
  });

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
        idProfile: parseInt(editProfile.profile.idProfile),
        Username: editProfile?.profile?.Username,
        Password: input.Password,
      },
    });
    if (!result.errors) {
      if (parseInt(editProfile?.profile?.idProfile) === idProfileConnected) {
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
        idProfile: parseInt(editProfile?.profile?.idProfile),
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
  if (!isProfileInList || idProfileInt === -1) return <>You cannot update this profile</>;
  return (
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
      <Typography>Username : {editProfile?.profile?.Username}</Typography>
      <TextField
        autoFocus
        error={isErrorInput.Password}
        margin="dense"
        id="Password"
        label="New Password?"
        type="password"
        value={input.Password}
        required
        variant="standard"
        onChange={handlePassword}
      />
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={0} spacing={1}>
        <IconButton area-label="cancel" onClick={() => navigate("/profiles")}>
          <CancelIcon />
        </IconButton>
        <IconButton area-label="save" onClick={handleSubmit} disabled={isLoading}>
          <SaveIcon />
        </IconButton>

        {isAdmin === "Y" && parseInt(editProfile?.profile?.idProfile) !== idProfileConnected && (
          <IconButton area-label="delete" onClick={handleDelete} disabled={isLoading}>
            <SaveIcon />
          </IconButton>
        )}
      </Stack>
      {updateError && <Typography color="error.main">{updateError?.message}</Typography>}
      {deleteError && <Typography color="error.main">{deleteError?.message}</Typography>}
    </Stack>
  );
};

export default EditProfile;
