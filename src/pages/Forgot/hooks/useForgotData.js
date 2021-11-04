import { useCallback, useMemo, useState } from "react";

import { forgotPassword } from "../../../api/forgotPassword";

export const useForgotData = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validation = useMemo(() => {
    if (!email) return { error: "Please enter Email" };

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(String(email).toLowerCase()))
      return { error: "Invalid email" };

    return { error: null };
  }, [email]);

  const resetPassword = useCallback(
    async (credentials) => {
      setError(validation.error);
      if (validation.error) {
        return;
      }

      setLoading(true);
      const { data, error: resError } = await forgotPassword(credentials);

      setError(resError);
      setLoading(false);

      if (!data) return;
    },
    [validation]
  );

  const reset = useCallback(() => {
    setEmail("");
    setLoading(false);
    setError(null);
  }, []);

  return {
    email,
    loading,
    error,

    resetPassword,
    setEmail,
    reset,
  };
};
