import React, { useEffect } from "react";
import { useHistory } from "react-router";

import Route from "../routes/state/types";
import { useUserData } from "../hooks";
import { isRoute } from "../utils";
import { UNAUTHORIZED_ROUTES } from "../routes/state/constants";

const RedirectContainer = ({ children }) => {
  const history = useHistory();
  const { isLoggedIn, homeUrl } = useUserData();

  useEffect(() => {
    if (!isLoggedIn) return;
    console.log("LOGGED IN");

    if (
      isRoute([...UNAUTHORIZED_ROUTES, { path: Route.ROOT, exact: true }]) &&
      homeUrl
    ) {
      history.push(homeUrl);
    }
  }, [isLoggedIn, history, homeUrl]);

  useEffect(() => {
    if (isLoggedIn) return;
    console.log("NOT LOGGED IN");

    if (isRoute([...UNAUTHORIZED_ROUTES, { path: Route.ROOT, exact: true }])) {
      return;
    }

    history.push(Route.ROOT);
  }, [isLoggedIn, history]);

  return <>{children}</>;
};

export default RedirectContainer;
