import { useCallback, useState } from "react";
import { useHistory } from "react-router";

import Route from "../../../routes/state/types";
import { confirmUser } from "../../../api/confirmUser";

export const useConfirmUserData = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const confirm = useCallback(async (confirmationCode) => {
    setLoading(true);
    const { data, error: resError } = await confirmUser({ confirmationCode });

    setError(resError);
    setLoading(false);

    if (!data) return;

    history.push(Route.LOGIN);
  }, [history]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,

    confirm,
    reset,
  };
};
