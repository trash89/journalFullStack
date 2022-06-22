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

  const [login, { error: loginError }] = useMutation(LOGIN_MUTATION, {
    onCompleted: ({ login }) => {
      const localObject = { token: login.token, idProfile: login.profile.idProfile, Username: login.profile.Username };
      addUserToLocalStorage(localObject);
      dispatch(loginUser(localObject));
    },
  });
  const [register, { error: registerError }] = useMutation(REGISTER_MUTATION, {
    onCompleted: ({ register }) => {
      const localObject = { token: register.token, idProfile: register.profile.idProfile, Username: register.profile.Username };
      addUserToLocalStorage(localObject);
      dispatch(registerUser(localObject));
    },
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { Username, Password, isMember } = values;
    if (!Password || (!isMember && !Username)) {
      toast.error("Please fill out all fields");
      return;
    }
    if (isMember) {
      login({
        variables: {
          Username: values.Username,
          Password: values.Password,
        },
      });
    } else {
      register({
        variables: {
          Username: values.Username,
          Password: values.Password,
        },
      });
    }
    return;
  };

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
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
        <button
          type="button"
          className="btn btn-block btn-hipster"
          disabled={isLoading}
          onClick={() => login({ variables: { Username: "demo", Password: "secret" } })}
        >
          {isLoading ? "loading..." : "demo app"}
        </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
        {loginError && <p>{loginError.message}</p>}
        {registerError && <p>{registerError.message}</p>}
      </form>
    </Wrapper>
  );
}
export default Register;
