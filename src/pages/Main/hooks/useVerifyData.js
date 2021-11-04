import { useCallback, useState } from "react";

import { verifyUser } from "../../../api/verifyUser";

export const useVerifyData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(async () => {
    setLoading(true);

    const { data, error: resError } = await verifyUser();

    setLoading(false);

    if (!data.success) {
      setError(resError);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,

    verify,
    reset,
  };
};
