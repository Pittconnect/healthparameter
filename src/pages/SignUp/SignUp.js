import React, { useCallback, useEffect, useMemo } from "react";

import AuthContainer from "../../components/AuthContainer";
import Route from "../../routes/state/types";
import PayButton from "./components/PayButton/PayButton";
import { useSignupData } from "./hooks/useSignupData";

const Signup = () => {
  const {
    username,
    email,
    password,
    pricing,
    memberships,
    error,
    loading,
    setUsername,
    setEmail,
    setPassword,
    setPricing,
    createPayment,
    approvePayment,
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
    {
      id: "pricing",
      label: "Choose a plan",
      value: pricing,
      onChange: setPricing,
      type: "select",
      options: memberships,
    },
  ];
  const buttons = useMemo(
    () => [
      !+pricing
        ? { id: "submit", type: "submit", text: "SIGNUP" }
        : {
            id: "pricing",
            component: PayButton,
            componentProps: {
              createOrder: createPayment,
              approveOrder: approvePayment,
            },
          },
    ],
    [pricing, createPayment, approvePayment]
  );
  const infoButtons = [{ id: "link", link: Route.LOGIN, text: "Login" }];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      console.log("username: ", username);
      console.log("email: ", email);
      console.log("password: ", password);

      signup({ username, email, password });
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
