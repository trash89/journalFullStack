import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FormRow } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { toast } from "react-toastify";
import { useIsMounted, useIsAdmin } from "../hooks";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

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
      count
      list {
        idProfile
        Username
        Is_Admin
      }
    }
  }
`;

const Profile = () => {
  const isMounted = useIsMounted();
  const { isLoading, user } = useSelector((store) => store.user);
  const idProfile = parseInt(user.idProfile || -1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useIsAdmin(idProfile);
  const [userData, setUserData] = useState({
    Username: user?.Username || "",
    Password: user?.Password || "",
  });
  const { loading, error, data } = useQuery(PROFILES_QUERY);
  console.log(data?.profiles?.list);
  const [updateProfile, { error: updateError }] = useMutation(UPDATE_MUTATION, {
    onCompleted: ({ update }) => {
      dispatch(logoutUser());
      toast.success(`Success, please reconnect, ${userData.Username} !`);
      navigate("/register");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { Username, Password } = userData;
    if (!Username || !Password) {
      toast.error("please fill out all fields");
      return;
    }
    updateProfile({
      variables: {
        idProfile: parseInt(user.idProfile),
        Username: userData.Username,
        Password: userData.Password,
      },
    });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  if (!isMounted) return <>Mounting...</>;
  if (!user) {
    return <Navigate to="/register" />;
  }
  if (isAdmin === "N") {
    return (
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
          <h3>profile</h3>
          <div className="form-center">
            <FormRow type="text" name="Username" value={userData.Username} handleChange={handleChange} />
            <FormRow type="password" name="Password" value={userData.Password} handleChange={handleChange} />
            <button type="submit" className="btn btn-block" disabled={isLoading}>
              {isLoading ? "Please Wait..." : "save changes"}
            </button>
            {updateError && <>{updateError.message}</>}
          </div>
        </form>
      </Wrapper>
    );
  } else {
    return (
      <Paper elevation={4}>
        <TableContainer component={Paper}>
          <Table aria-label="profiles" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right">ID</TableCell>
                <TableCell align="left">Username</TableCell>
                <TableCell align="right">Is Admin?</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.profiles?.list.map((row) => {
                return (
                  <TableRow key={row.idProfile} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell align="right">{row.idProfile}</TableCell>
                    <TableCell align="left">{row.Username}</TableCell>
                    <TableCell align="right">{row.Is_Admin}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
};

export default Profile;
