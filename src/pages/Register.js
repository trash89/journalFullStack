import { useState, useEffect } from "react";
import { Logo, FormRow } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { addUserToLocalStorage } from "../utils/localStorage";
import { useIsMounted } from "../hooks";

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

const initialState = {
  Username: "",
  Password: "",
  isMember: true,
};

function Register() {
  const isMounted = useIsMounted();
  const [values, setValues] = useState(initialState);
  const { user, isLoading } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { error: loginError }] = useMutation(LOGIN_MUTATION);
  const [register, { error: registerError }] = useMutation(REGISTER_MUTATION);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { Username, Password, isMember } = values;
    if (!Password || (!isMember && !Username)) {
      toast.error("Please fill out all fields");
      return;
    }
    if (isMember) {
      const result = await login({
        variables: {
          Username: values.Username,
          Password: values.Password,
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
          Username: values.Username,
          Password: values.Password,
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
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
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
  }, [user]);

  if (!isMounted) return <></>;
  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        <FormRow type="text" name="Username" value={values.Username} handleChange={handleChange} />
        <FormRow type="password" name="Password" value={values.Password} handleChange={handleChange} />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {isLoading ? "loading..." : "submit"}
        </button>
        <button type="button" className="btn btn-block btn-hipster" disabled={isLoading} onClick={loginDemo}>
          {isLoading ? "loading..." : "demo app"}
        </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
        {loginError && <Typography color="error.main">{loginError.message}</Typography>}
        {registerError && <Typography color="error.main">{registerError.message}</Typography>}
      </form>
    </Wrapper>
  );
}
export default Register;
