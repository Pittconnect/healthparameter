import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";
import clsx from "clsx";

import AuthContainerFormInputs from "./components/AuthContainerFormInputs";
import AuthContainerFormButtons from "./components/AuthContainerFormButtons";

const AuthContainer = ({
  type,
  error,
  loading,
  loadingText,
  successText,
  header,
  info,
  inputs,
  buttons,
  inputSpacing,
  onSubmit,
  formOnRight = false,
}) => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.state) return;
    history.replace({ ...location, state: { modal: { isOpened: true } } });
  }, [history, location]);

  return (
    <div
      className={`modal__content modal__content--${type} modal__content--visible`}
    >
      <div
        className={clsx(
          "uk-overlay uk-overlay-primary uk-position-cover uk-position-z-index",
          {
            "uk-hidden": !successText,
          }
        )}
      >
        <div
          className="uk-grid uk-grid-column-collapse uk-grid-row-medium uk-text-center uk-child-width-1-1 uk-position-center uk-text-secondary"
          uk-grid=""
        >
          <span uk-icon="icon: check; ratio: 2.5" />
          <span className="uk-text-large uk-text-bold">{successText}</span>
        </div>
      </div>
      <div
        className={clsx(
          "uk-overlay uk-overlay-primary uk-position-cover uk-position-z-index",
          {
            "uk-hidden": !loading,
          }
        )}
      >
        <div
          className="uk-grid uk-grid-column-collapse uk-grid-row-medium uk-text-center uk-child-width-1-1 uk-position-center uk-text-secondary"
          uk-grid=""
        >
          <span uk-spinner="ratio: 2.5" />
          <span className="uk-margin-small uk-text-large uk-text-bold">
            {loadingText}
          </span>
        </div>
      </div>
      <div
        className={clsx(
          "modal__form form uk-animation-fade uk-animation-fast",
          { "uk-flex-last": formOnRight }
        )}
      >
        <span
          className={clsx(
            "uk-flex uk-alert-danger uk-width-1-1 uk-margin-small uk-padding-small uk-text-default uk-text-center uk-text-left@s",
            {
              "uk-invisible uk-hidden-touch": !error,
            }
          )}
          uk-alert=""
        >
          {error}
        </span>
        <h2 className="form__title">{header}</h2>

        {(inputs || buttons) && (
          <form className="form__container" onSubmit={onSubmit}>
            {inputs && (
              <AuthContainerFormInputs inputs={inputs} spacing={inputSpacing} />
            )}
            {buttons && <AuthContainerFormButtons buttons={buttons} />}
          </form>
        )}
      </div>
      <div className="modal__info uk-animation-slide-left-medium">
        {info?.title && <h2 className="modal__title">{info.title}</h2>}
        {info?.description && (
          <div className="modal__descr">{info.description}</div>
        )}
        <ul className="modal__list">
          {info?.list && info.list.map((item, id) => <li key={id}>{item}</li>)}
        </ul>

        {info?.buttons && <AuthContainerFormButtons buttons={info.buttons} />}
      </div>
    </div>
  );
};

export default AuthContainer;
