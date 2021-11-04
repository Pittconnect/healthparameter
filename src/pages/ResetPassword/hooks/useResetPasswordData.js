import { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router";

import Route from "../../../routes/state/types";
import { resetPassword } from "../../../api/resetPassword";

export const useResetPasswordData = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    if (!password) return { error: "Please enter Password" };

    if (password && password.length < 6)
      return { error: "Password should be 6 symbols at least" };

    return { error: null };
  }, [password]);

  const resetUserPassword = useCallback(
    async (credentials) => {
      setError(validation.error);
      if (validation.error) {
        return;
      }

      setLoading(true);

      const { error: resError } = await resetPassword(credentials);

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
    setPassword("");
    setLoading(false);
    setError(null);
  }, []);

  return {
    password,
    loading,
    error,

    setPassword,
    resetUserPassword,
    reset,
  };
};
