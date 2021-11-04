import { useCallback, useContext } from "react";

import { UserContext } from "../context/user";

export const useUserData = () => {
  const { user, clearUserData } = useContext(UserContext);

  const isLoggedIn = user.token && user.username;

  const logout = useCallback(clearUserData, [clearUserData]);

  return {
    ...user,
    isLoggedIn,

    logout,
  };
};
