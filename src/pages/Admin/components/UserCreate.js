import React, { useCallback, useEffect } from "react";

import UserFormContainer from "./FormContainer";
import { useUserCreateData } from "../state/hooks/useCreateUserData";
import { userRoles, usaOption } from "../state/constants";
import { usaStatesAbbr } from "../../../helpers/constants";

const UserCreate = () => {
  const {
    username,
    password,
    role,
    location,
    error,
    loading,
    setUsername,
    setPassword,
    setRole,
    setLocation,
    create,
    reset,
  } = useUserCreateData();

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
      id: "role",
      label: "Select user role",
      value: role,
      onChange: setRole,
      type: "select",
      options: userRoles,
    },
    {
      id: "location",
      label: "Select user location",
      value: location,
      onChange: setLocation,
      type: "select",
      options: [usaOption, ...usaStatesAbbr],
    },
  ];

  const buttons = [{ id: "submit", type: "submit", text: "Create" }];

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      create({ username, password, role, location });
    },
    [username, password, role, location, create]
  );

  useEffect(() => {
    return reset;
  }, [reset]);

  return (
    <UserFormContainer
      error={error}
      loading={loading}
      loadingText={"Creating new user"}
      header={"Create user"}
      inputs={inputs}
      buttons={buttons}
      onSubmit={handleSubmit}
    />
  );
};

export default UserCreate;
