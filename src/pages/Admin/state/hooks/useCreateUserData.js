import { useCallback, useContext, useMemo, useState } from "react";

import { createUser } from "../../../../api/user";
import { UserContext } from "../../../../context/User/userContext";

export const useUserCreateData = () => {
  const { addUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    if (!username || !password)
      return { error: "Please enter Username and Password" };

    const usernamePattern =
      /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if (!usernamePattern.test(String(username).toLowerCase()))
      return { error: "Invalid username" };

    if (password && password.length < 6)
      return { error: "Password should be 6 symbols at least" };

    if (!role) return { error: "Please select user role" };

    if (!location) return { error: "Please select user location" };

    return { error: null };
  }, [username, password, role, location]);

  const reset = useCallback(() => {
    setUsername("");
    setPassword("");
    setRole("");
    setLocation("");
    setLoading(false);
    setError(null);
  }, []);

  const create = useCallback(
    async (userData) => {
      setError(validation.error);
      if (validation.error) return;

      setLoading(true);

      const { data, error: resError } = await createUser(userData);

      setError(resError);
      setLoading(false);

      addUser({ ...data.user, error: resError });

      reset();
    },
    [validation, addUser, reset]
  );

  return {
    username,
    password,
    role,
    location,
    loading,
    error,

    setUsername,
    setPassword,
    setRole,
    setLocation,
    create,
    reset,
  };
};
