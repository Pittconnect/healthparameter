import React, { useEffect } from "react";
import { useHistory } from "react-router";

import Route from "../routes/state/types";
import { useUserData } from "../hooks";
import { isRoute } from "../utils";
import { PRIVATE_ROUTES, UNAUTHORIZED_ROUTES } from "../routes/state/constants";

const RedirectContainer = ({ children }) => {
  const history = useHistory();
  const { isLoggedIn, homeUrl, hasRoutePermissions } = useUserData();

  useEffect(() => {
    if (!isLoggedIn) return;
    console.log("LOGGED IN");

    if (
      isRoute([...UNAUTHORIZED_ROUTES, { path: Route.ROOT, exact: true }]) &&
      homeUrl
    ) {
      history.push(homeUrl);
      return;
    }

    const privateRoute = PRIVATE_ROUTES.find((item) => isRoute(item));
    if (
      !isRoute(Route.NOT_FOUND) &&
      privateRoute &&
      !hasRoutePermissions(privateRoute)
    ) {
      history.push(Route.NOT_FOUND);
    }
  }, [isLoggedIn, history, homeUrl, hasRoutePermissions]);

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
