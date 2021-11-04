import React from "react";
import clsx from "clsx";
import { useHistory, useLocation } from "react-router";

const AuthModalContainer = ({ children, parentRoute }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <section
      className={clsx("modal modal--signuplogin", {
        "modal--visible": location.state?.modal?.isOpened,
        "uk-hidden": !location.state?.modal?.isOpened,
      })}
    >
      <div
        className="modal__overlay modal__overlay--toggle"
        onClick={() => history.push(parentRoute)}
      />
      <div className="modal__wrapper modal-transition uk-animation-slide-top-medium uk-animation-fade animation-medium">
        <div className="modal__body">{children}</div>
      </div>
    </section>
  );
};

export default AuthModalContainer;
