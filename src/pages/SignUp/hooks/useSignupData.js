import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";

import Route from "../../../routes/state/types";
import { signupUser } from "../../../api/signupUser";

export const useSignupData = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    if (!username || !password || !email)
      return { error: "Please enter Username, Email and Password" };

    const usernamePattern =
      /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (!usernamePattern.test(String(username).toLowerCase()))
      return { error: "Invalid username" };

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(String(email).toLowerCase()))
      return { error: "Invalid email" };

    if (password && password.length < 6)
      return { error: "Password should be 6 symbols at least" };

    return { error: null };
  }, [username, email, password]);

  const signup = useCallback(
    async (credentials) => {
      setError(validation.error);
      if (validation.error) {
        return;
      }

      setLoading(true);

      const { error: resError } = await signupUser(credentials);

      setLoading(false);

      if (resError) {
        setError(resError);
      } else {
        history.push(Route.LOGIN);
      }
    },
    [validation, history]
  );

  const reset = useCallback(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setLoading(false);
    setError(null);
  }, []);

  return {
    username,
    email,
    password,
    loading,
    error,

    signup,
    setUsername,
    setEmail,
    setPassword,
    reset,
  };
};
