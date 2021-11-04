import React, { useEffect } from "react";
import { useParams } from "react-router";

import AuthContainer from "../../components/AuthContainer";
import { useConfirmUserData } from "./hooks/useConfirmUserData";

const ConfirmUser = () => {
  const { confirmationCode } = useParams();
  const { error, loading, confirm, reset } = useConfirmUserData();

  useEffect(() => {
    confirm(confirmationCode);
  }, [confirm, confirmationCode]);

  useEffect(() => {
    return reset;
  }, [reset]);

  return (
    <AuthContainer
      error={error}
      loading={loading}
      loadingText="Confirm user registration"
      type="confirm"
      header="Confirm User"
      info={{
        title: "Everything is ready",
        description: "Confirm your account to use the available functionality.",
      }}
    />
  );
};

export default ConfirmUser;
