import React, { useCallback, useEffect } from "react";

import Route from "../../routes/state/types";
import AuthContainer from "../../components/AuthContainer";
import { useLoginData } from "./hooks/useLoginData";

const Login = () => {
  const {
    username,
    password,
    isRemember,
    error,
    loading,
    setUsername,
    setPassword,
    toggleIsRemember,
    login,
    reset,
  } = useLoginData();

  const inputs = [
    {
      id: "username",
      label: "Username",
      value: username,
      onChange: setUsername,
    },
    {
      id: "password",
      label: "Password",
      value: password,
      onChange: setPassword,
      type: "password",
    },
    {
      id: "remember",
      label: "Keep me Signed in",
      value: isRemember,
      type: "checkbox",
      onToggle: toggleIsRemember,
    },
  ];

  const buttons = [
    { id: "forgot", type: "text", link: Route.FORGOT, text: "Forgot Password?" },
    { id: "submit", type: "submit", text: "LOGIN" },
  ];
  const infoButtons = [{ id: "link", link: Route.SIGNUP, text: "Signup" }];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      console.log("username: ", username);
      console.log("password: ", password);

      login({ username, password });
    },
    [username, password, login]
  );

  useEffect(() => {
    return reset;
  }, [reset]);

  return (
    <AuthContainer
      error={error}
      loading={loading}
      loadingText="Checking credentials"
      type="login"
      header="Login"
      info={{
        title: "First time here?",
        description: (
          <>
            Join now and get <span>20% OFF</span> for all products
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
      formOnRight
    />
  );
};

export default Login;
