import React from "react";

import ContainerInput from "./ContainerInput";

const ContainerFormInputs = ({ inputs }) => {
  return (
    <>
      {inputs.map((inputProps) => (
        <ContainerInput key={inputProps.id} {...inputProps} />
      ))}
    </>
  );
};

export default ContainerFormInputs;
