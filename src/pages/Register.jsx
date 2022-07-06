import React from "react";
import { useState, useEffect } from "react";
import { Logo } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { addUserToLocalStorage } from "../utils/localStorage";
import { useIsMounted } from "../hooks";

import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";

const REGISTER_MUTATION = gql`
  mutation RegisterMutation($Username: String!, $Password: String!) {
    register(profile: { Username: $Username, Password: $Password }) {
      token
      profile {
        idProfile
        Username
      }
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($Username: String!, $Password: String!) {
    login(Username: $Username, Password: $Password) {
      token
      profile {
        idProfile
        Username
      }
    }
  }
`;

function Register() {
  const isMounted = useIsMounted();
  const [input, setInput] = useState({
    Username: "",
    Password: "",
    isMember: true,
  });
  const [isErrorInput, setIsErrorInput] = useState({
    Username: false,
    Password: false,
    isMember: false,
  });

  const { user, isLoading } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { loading: loadingLogin, error: loginError }] = useMutation(LOGIN_MUTATION);
  const [register, { loading: loadingRegister, error: registerError }] = useMutation(REGISTER_MUTATION);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (input.Username && input.Username !== "") {
      if (input.Password && input.Password !== "") {
        const { Username, Password, isMember } = input;
        if (!Password || (!isMember && !Username)) {
          return;
        }
        if (isMember) {
          const result = await login({
            variables: {
              Username: input.Username,
              Password: input.Password,
            },
          });
          if (!result?.errors) {
            const localObject = {
              token: result?.data?.login?.token,
              idProfile: result?.data?.login?.profile?.idProfile,
              Username: result?.data?.login?.profile?.Username,
            };
            addUserToLocalStorage(localObject);
            dispatch(loginUser(localObject));
          }
        } else {
          const result = await register({
            variables: {
              Username: input.Username,
              Password: input.Password,
            },
          });
          if (!result?.errors) {
            const localObject = {
              token: result?.data?.register?.token,
              idProfile: result?.data?.register?.profile?.idProfile,
              Username: result?.data?.register?.profile?.Username,
            };
            addUserToLocalStorage(localObject);
            dispatch(registerUser(localObject));
          }
        }
        return;
      } else {
        setIsErrorInput({ ...isErrorInput, Password: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, Username: true });
    }
  };

  const toggleMember = () => {
    setInput({ ...input, isMember: !input.isMember });
  };
  const handleUsername = async (e) => {
    setInput({ ...input, Username: e.target.value });
    if (isErrorInput.Username) setIsErrorInput({ ...isErrorInput, Username: false });
  };
  const handlePassword = async (e) => {
    setInput({ ...input, Password: e.target.value });
    if (isErrorInput.Password) setIsErrorInput({ ...isErrorInput, Password: false });
  };

  const loginDemo = async () => {
    const result = await login({ variables: { Username: "demo", Password: "secret" } });
    if (!result?.errors) {
      const localObject = {
        token: result?.data?.login?.token,
        idProfile: result?.data?.login?.profile?.idProfile,
        Username: result?.data?.login?.profile?.Username,
      };
      addUserToLocalStorage(localObject);
      dispatch(loginUser(localObject));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [user]);

  if (!isMounted) return <></>;
  if (isLoading || loadingLogin || loadingRegister) return <CircularProgress />;
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{input.isMember ? "Login" : "Register"}</h3>
        <InputLabel error={isErrorInput.Username}>Username</InputLabel>
        <TextField
          error={isErrorInput.Username}
          autoFocus
          size="small"
          margin="dense"
          id="Username"
          type="text"
          value={input.Username}
          onChange={handleUsername}
          required
          variant="outlined"
          fullWidth
        />
        <InputLabel error={isErrorInput.Password}>Password</InputLabel>
        <TextField
          error={isErrorInput.Password}
          size="small"
          margin="dense"
          id="Password"
          type="password"
          value={input.Password}
          onChange={handlePassword}
          required
          variant="outlined"
          fullWidth
        />

        <Button type="submit" className="btn btn-block" disabled={isLoading} variant="contained" size="small">
          {isLoading ? "loading..." : "connect"}
        </Button>
        <Button type="button" className="btn btn-block btn-hipster" disabled={isLoading} onClick={loginDemo} variant="contained" size="small">
          {isLoading ? "loading..." : "demo app"}
        </Button>
        <p>
          {input.isMember ? "Not a member yet?" : "Already a member?"}
          <Button type="button" onClick={toggleMember} className="member-btn" variant="text" size="small">
            {input.isMember ? "Register" : "Login"}
          </Button>
        </p>
        {loginError && <Typography color="error.main">{loginError.message}</Typography>}
        {registerError && <Typography color="error.main">{registerError.message}</Typography>}
      </form>
    </Wrapper>
  );
}
export default Register;
