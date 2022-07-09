import { USER } from "./constants";

export const addUserToLocalStorage = (user) => {
  const obj = {
    token: user?.token,
    idProfile: user?.idProfile,
    Username: user?.Username,
  };
  localStorage.setItem(USER, JSON.stringify(obj));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem(USER);
};

export const getUserFromLocalStorage = () => {
  const result = localStorage.getItem(USER);

  const user = result ? JSON.parse(result) : null;
  return user;
};
