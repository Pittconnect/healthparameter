import React, { useCallback, useEffect } from "react";

import AuthContainer from "../../components/AuthContainer";
import Route from "../../routes/state/types";
import { useSignupData } from "./hooks/useSignupData";

const Signup = () => {
  const {
    username,
    email,
    password,
    error,
    loading,
    setUsername,
    setEmail,
    setPassword,
    signup,
    reset,
  } = useSignupData();

  const inputs = [
    {
      id: "username",
      label: "Username",
      value: username,
      onChange: setUsername,
    },
    {
      id: "email",
      label: "Email",
      value: email,
      onChange: setEmail,
    },
    {
      id: "password",
      label: "Password",
      value: password,
      onChange: setPassword,
      type: "password",
    },
  ];

  const buttons = [{ id: "submit", type: "submit", text: "SIGNUP" }];
  const infoButtons = [{ id: "link", link: Route.LOGIN, text: "Login" }];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      console.log("username: ", username);
      console.log("email: ", email);
      console.log("password: ", password);
      const payment = {
        sender_batch_header: {
          recipient_type: "EMAIL",
          email_message: "Dbilia USD Payouts",
          note: "USD withdrawal request",
          sender_batch_id: new Date().toISOString(), // must be unique per batch
          email_subject: "[Dbilia] You've requested for withdrawal.",
        },
        items: [
          {
            note: "USD withdrawal request",
            amount: {
              currency: "USD",
              value: 123,
            },
            receiver: "sb-5zwh38384833@business.example.com",
            sender_item_id: "4FX733YULQG68",
          },
        ],
      };

      signup({ username, email, password, payment });
    },
    [username, email, password, signup]
  );

  useEffect(() => {
    return reset;
  }, [reset]);

  return (
    <AuthContainer
      error={error}
      loading={loading}
      loadingText="Сreating a new user"
      type="signup"
      header="Signup"
      info={{
        title: "Already have an account?",
        description: (
          <>
            Login now and starting using our <span>amazing</span> products
          </>
        ),
        list: [
          "premium access to all products",
          "free testing tools",
          "unlimited user accounts",
        ],
        buttons: infoButtons,
      }}
      inputs={inputs}
      buttons={buttons}
      onSubmit={handleSubmit}
    />
  );
};

export default Signup;
