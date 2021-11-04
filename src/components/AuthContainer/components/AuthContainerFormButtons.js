import React from "react";

import AuthContainerButton from "./AuthContainerButton";

const AuthContainerFormButtons = ({ buttons }) => {
  return (
    <>
      {buttons.map((butonProps) => (
        <AuthContainerButton key={butonProps.id} {...butonProps} />
      ))}
    </>
  );
};

export default AuthContainerFormButtons;
