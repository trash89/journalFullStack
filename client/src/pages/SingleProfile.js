import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { logoutUser } from "../features/user/userSlice";
import { useIsMounted, useIsAdmin } from "../hooks";

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
const verifyProfileInList = (idProfile, list) => {
  if (list) {
    return list?.includes(idProfile);
  }
  return false;
};
const SingleProfile = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);
  const idProfileConnected = parseInt(user.idProfile || -1);
  const isAdmin = useIsAdmin(idProfileConnected);

  const { idProfile } = useParams();

  const { data: profilesList } = useQuery(PROFILES_QUERY);
  const profilesArray = profilesList?.profiles?.list?.map((profile) => profile?.idProfile);

  const isProfileInList = verifyProfileInList(idProfile, profilesArray);

  const { data: editProfile } = useQuery(EDIT_PROFILE_QUERY, {
    variables: { idProfile: parseInt(idProfile) },
  });

  const [input, setInput] = useState({
    Password: "",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    Password: false,
  });

  const [updateProfile, { error: updateError }] = useMutation(UPDATE_MUTATION, {
    onCompleted: ({ updateProfile }) => {
      if (parseInt(editProfile.profile.idProfile) === idProfileConnected) {
        dispatch(logoutUser());
        toast.success(`Success, please reconnect, ${updateProfile.Username} !`);
        navigate("/register");
      } else {
        toast.success(`Success, ${updateProfile.Username} !`);
        navigate("/profiles");
      }
    },
  });
  const [deleteProfile, { error: deleteError }] = useMutation(DELETE_MUTATION, {
    onCompleted: ({ deleteProfile }) => {
      toast.success(`Success, ${deleteProfile.Username} !`);
      navigate("/profiles");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { Password } = input;
    if (!Password) {
      setIsErrorInput({ ...isErrorInput, Password: true });
      toast.error("please fill out all fields");
      return;
    }
    updateProfile({
      variables: {
        idProfile: parseInt(editProfile.profile.idProfile),
        Username: editProfile?.profile?.Username,
        Password: input.Password,
      },
    });
  };
  const handleDelete = (e) => {
    e.preventDefault();
    deleteProfile({
      variables: {
        idProfile: parseInt(editProfile.profile.idProfile),
      },
    });
  };

  const handlePassword = (e) => {
    setInput({ ...input, Password: e.target.value });
    if (isErrorInput.Password) setIsErrorInput({ ...isErrorInput, Password: false });
  };

  if (!isMounted) return <></>;
  if (!isProfileInList) return <>You cannot update this profile</>;
  return (
    <Paper elevation={4}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" padding={1} spacing={1}>
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
          <Button
            variant="text"
            size="small"
            onClick={() => {
              navigate("/profiles");
            }}
          >
            cancel
          </Button>
          <Button variant="text" size="small" onClick={handleSubmit}>
            save
          </Button>
          {isAdmin === "Y" && parseInt(editProfile.profile.idProfile) !== idProfileConnected && (
            <Button variant="text" size="small" onClick={handleDelete}>
              delete
            </Button>
          )}
        </Stack>
        {updateError && <>{updateError?.message}</>}
        {deleteError && <>{deleteError?.message}</>}
      </Stack>
    </Paper>
  );
};

export default SingleProfile;
