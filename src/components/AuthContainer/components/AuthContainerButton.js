import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

const AuthContainerButton = ({
  id,
  type,
  text,
  link,
  component,
  componentProps,
}) => {
  const Button = link ? Link : "button";
  const linkName = link && link.substring(1);
  const AuthButton = component;

  return component ? (
    <AuthButton {...componentProps} />
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

export default AuthContainerButton;