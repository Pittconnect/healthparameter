import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

const ContainerButton = ({
  id,
  type,
  text,
  link,
  component,
  componentProps,
}) => {
  const Button = link ? Link : "button";
  const linkName = link && link.substring(1);
  const FormButton = component;

  return component ? (
    <FormButton {...componentProps} />
  ) : (
    <Button
      id={id}
      type={type}
      className={clsx({
        "form__submit btn btn--blue-bg": type !== "text",
        modal__switch: type === "text",
        [`modal__switch--${linkName}`]: link,
      })}
      to={link && { pathname: link, state: { modal: { isOpened: true } } }}
    >
      {text}
    </Button>
  );
};

export default ContainerButton;
