import React, { useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router";
import UIkit from "uikit";
import clsx from "clsx";

import Route from "../../routes/state/types";
import AuthenticatedRoutes from "../../routes/components/AuthenticatedRoutes";
import { useLocalStorage, useUserData } from "../../hooks";
import { initialState } from "../../context/user";
import { useVerifyData } from "./hooks/useVerifyData";

import "./Main.scss";

const MainPage = () => {
  const history = useHistory();
  const [, setUserLocalState] = useLocalStorage("user_state", "");
  const { username, isLoggedIn, logout } = useUserData();
  const { verify, loading, error } = useVerifyData();

  useLayoutEffect(() => {
    if (isLoggedIn) {
      verify();
    }
  }, [verify, isLoggedIn]);

  useEffect(() => {
    if (error) {
      UIkit.notification({
        message: error,
        status: "danger",
        pos: "top-right",
        timeout: 5000,
      });

      setUserLocalState(initialState.user);
      history.push(Route.ROOT);
    }
  }, [error, history, setUserLocalState]);

  return (
    <div className="covid-map">
      <div className="map-panel uk-position-absolute uk-position-z-index uk-width-auto uk-position-top-right uk-flex uk-flex-middle uk-tile uk-tile-muted uk-text-secondary uk-border-pill ">
        <div className="uk-text-default">{username}</div>
        <span className="signout-icon uk-iconnav" onClick={logout}>
          <span uk-icon="icon: sign-out; ratio: 1.25" />
        </span>
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
        </div>
      </div>
      {isLoggedIn && <AuthenticatedRoutes />}
    </div>
  );
};

export default MainPage;
