import React from "react";

import ContainerButton from "./ContainerButton";

const ContainerFormButtons = ({ buttons }) => {
  return (
    <>
      {buttons.map((butonProps) => (
        <ContainerButton key={butonProps.id} {...butonProps} />
      ))}
    </>
  );
};

export default ContainerFormButtons;
