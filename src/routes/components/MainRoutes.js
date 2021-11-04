import React, { useMemo } from "react";
import { Route, Switch, useLocation } from "react-router";

import mainRoutes from "../mainRoutes";
import AuthModalContainer from "../../layout/AuthModalContainer";
import { SEC_UNAUTHORIZED_ROUTES } from "../state/constants";

const renderRoutes = (routes, isRouteSecondary) =>
  routes.map(({ subRoutes, ...restRouteProps }) =>
    subRoutes ? (
      <Route
        key={restRouteProps.path}
        path={restRouteProps.path}
        exact={isRouteSecondary}
        render={() => (
          <>
            <Route {...restRouteProps} />
            <AuthModalContainer parentRoute={restRouteProps.path}>
              <Switch>{renderRoutes(subRoutes, isRouteSecondary)}</Switch>
            </AuthModalContainer>
          </>
        )}
      />
    ) : (
      <Route key={restRouteProps.path} {...restRouteProps} />
    )
  );

const MainRoutes = () => {
  const { pathname } = useLocation();

  const isRouteSecondary = useMemo(
    () => SEC_UNAUTHORIZED_ROUTES.some((route) => route === pathname),
    [pathname]
  );

  return <Switch>{renderRoutes(mainRoutes, isRouteSecondary)}</Switch>;
};

export default MainRoutes;
