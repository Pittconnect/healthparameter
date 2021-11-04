import { useCallback, useContext, useMemo, useState } from "react";

import Route from "../../../routes/state/types";
import { loginUser } from "../../../api/loginUser";
import { UserContext } from "../../../context/user";

export const useLoginData = () => {
  const { setUserData } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    if (!username || !password)
      return { error: "Please enter Username and Password" };

    const usernamePattern =
      /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (!usernamePattern.test(String(username).toLowerCase()))
      return { error: "Invalid username" };

    if (password && password.length < 6)
      return { error: "Password should be 6 symbols at least" };

    return { error: null };
  }, [username, password]);

  const login = useCallback(
    async (credentials) => {
      setError(validation.error);
      if (validation.error) {
        return;
      }

      setLoading(true);

      const { data, error: resError } = await loginUser(credentials);

      setError(resError);
      setLoading(false);

      if (!data) return;

      const { token, expiresIn } = data;

      setUserData({
        username: credentials.username,
        homeUrl: Route.MAP,
        token,
        expiresIn,
      });
    },
    [setUserData, validation]
  );

  const toggleIsRemember = useCallback(
    () => setIsRemember((state) => !state),
    []
  );

  const reset = useCallback(() => {
    setUsername("");
    setPassword("");
    setLoading(false);
    setError(null);
  }, []);

  return {
    username,
    password,
    isRemember,
    loading,
    error,

    login,
    setUsername,
    setPassword,
    setIsRemember,
    toggleIsRemember,
    reset,
  };
};
