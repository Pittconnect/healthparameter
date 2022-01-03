import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";

import AuthContainer from "../../components/AuthContainer";
import { useResetPasswordData } from "./hooks/useResetPasswordData";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const { password, error, loading, resetUserPassword, setPassword, reset } =
    useResetPasswordData();

  const inputs = [
    {
      id: "password",
      label: "New Password",
      value: password,
      onChange: setPassword,
      type: "password",
    },
  ];

  const buttons = [{ id: "submit", type: "submit", text: "RESET MY PASSWORD" }];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      console.log("password: ", password);

      resetUserPassword({ password, resetToken });
    },
    [password, resetUserPassword, resetToken]
  );

  useEffect(() => {
    return reset;
  }, [reset]);

  return (
    <AuthContainer
      error={error}
      loading={loading}
      loadingText="Setting a new password"
      type="reset"
      header="Reset your password"
      info={{
        title: "Restore the access.",
        description: (
          <>
            Your new password should be <span>different</span> from previous
            used password
          </>
        ),
        list: ["should be at least 6 symbols"],
      }}
      inputs={inputs}
      buttons={buttons}
      onSubmit={handleSubmit}
    />
  );
};

export default ResetPassword;
