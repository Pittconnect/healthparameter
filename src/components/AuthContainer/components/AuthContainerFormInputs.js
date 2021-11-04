import React from "react";

import AuthContainerInput from "./AuthContainerInput";

const AuthContainerFormInputs = ({ inputs }) => {
  return (
    <>
      {inputs.map((inputProps) => (
        <AuthContainerInput key={inputProps.id} {...inputProps} />
      ))}
    </>
  );
};

export default AuthContainerFormInputs;
