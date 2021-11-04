import React, { useCallback, useEffect } from "react";

import Route from "../../routes/state/types";
import AuthContainer from "../../components/AuthContainer";
import { useForgotData } from "./hooks/useForgotData";

const Forgot = () => {
  const { email, error, loading, setEmail, resetPassword, reset } =
    useForgotData();

  const inputs = [
    {
      id: "email",
      label: "Email",
      value: email,
      onChange: setEmail,
    },
  ];

  const buttons = [{ id: "submit", type: "submit", text: "RESET PASSWORD" }];
  const infoButtons = [{ id: "link", link: Route.LOGIN, text: "Login" }];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      console.log("email: ", email);

      resetPassword({ email });
    },
    [email, resetPassword]
  );

  useEffect(() => {
    return reset;
  }, [reset]);

  return (
    <AuthContainer
      error={error}
      loading={loading}
      loadingText="Finding the user"
      type="forgot"
      header="Forgot Password"
      info={{
        title: "We got you covered",
        description:
          "A new password will be sent by email. Remembered your password?",
        buttons: infoButtons,
      }}
      inputs={inputs}
      buttons={buttons}
      onSubmit={handleSubmit}
    />
  );
};

export default Forgot;
