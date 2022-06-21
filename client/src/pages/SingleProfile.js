import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
const PROFILES_QUERY = gql`
  query profilesQuery {
    profiles {
      list {
        idProfile
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
  return list?.includes(idProfile);
};
const SingleProfile = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, user } = useSelector((store) => store.user);
  const idProfileConnected = parseInt(user.idProfile || -1);
  const isAdmin = useIsAdmin(idProfileConnected);

  const { idProfile } = useParams();
  const { data: profilesList, refetch: refetchProfilesList } = useQuery(PROFILES_QUERY);
  const profilesArray = profilesList?.profiles?.list?.map((profile) => profile?.idProfile);

  const isProfileInList = verifyProfileInList(idProfile, profilesArray);

  const { data: editProfile, refetch: refetchEditProfile } = useQuery(EDIT_PROFILE_QUERY, {
    variables: { idProfile: parseInt(idProfile) },
  });

  const [input, setInput] = useState({
    Username: editProfile?.profile?.Username || "",
    Password: "",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    Username: false,
    Password: false,
  });

  const [updateProfile, { error: updateError }] = useMutation(UPDATE_MUTATION, {
    onCompleted: () => {
      dispatch(logoutUser());
      toast.success(`Success, please reconnect, ${input.Username} !`);
      navigate("/register");
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const { Username, Password } = input;
    if (!Username || !Password) {
      setIsErrorInput({ ...isErrorInput, Password: true });
      toast.error("please fill out all fields");
      return;
    }
    console.log("input.Username=", input.Username);
    console.log("input.Password=", input.Password);
    updateProfile({
      variables: {
        idProfile: parseInt(editProfile.idProfile),
        Username: input.Username,
        Password: input.Password,
      },
    });
  };

  const handleUsername = (e) => {
    setInput({ ...input, Username: e.target.value });
    if (isErrorInput.Username) setIsErrorInput({ ...isErrorInput, Username: false });
  };
  const handlePassword = (e) => {
    setInput({ ...input, Password: e.target.value });
    if (isErrorInput.Password) setIsErrorInput({ ...isErrorInput, Password: false });
  };
  useEffect(() => {
    refetchProfilesList();
    refetchEditProfile({ idProfile: parseInt(idProfile) });
  }, []);

  if (!isMounted) return <></>;
  if (!isProfileInList) return <>You cannot update this profile</>;
  return (
    <Paper elevation={4}>
      <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" padding={1} spacing={0}>
        <TextField
          error={isErrorInput.Username}
          autoFocus
          margin="dense"
          id="Username"
          label="Username"
          type="text"
          disabled
          value={input.Username}
          required
          variant="standard"
          onChange={handleUsername}
        />
        <TextField
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
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" padding={1} spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              navigate("/profiles");
            }}
          >
            cancel
          </Button>
          <Button variant="contained" size="small" onClick={handleSubmit}>
            save changes
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SingleProfile;
// if (isAdmin === "N") {
//   return (
//     <Wrapper>
//       <form className="form" onSubmit={handleSubmit}>
//         <h3>profile</h3>
//         <div className="form-center">
//           <FormRow type="text" name="Username" value={userData.Username} handleChange={handleChange} />
//           <FormRow type="password" name="Password" value={userData.Password} handleChange={handleChange} />
//           <button type="submit" className="btn btn-block" disabled={isLoading}>
//             {isLoading ? "Please Wait..." : "save changes"}
//           </button>
//           {updateError && <>{updateError.message}</>}
//         </div>
//       </form>
//     </Wrapper>
//   );
// } else {
