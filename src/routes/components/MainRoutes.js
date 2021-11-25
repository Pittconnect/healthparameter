import React, { useMemo } from "react";
import { Route, Switch, useLocation } from "react-router";

import mainRoutes from "../mainRoutes";
import AuthModalContainer from "../../layout/AuthModalContainer";
import { AUTHORIZED_ROUTES } from "../state/constants";

const renderRoutes = (routes, isAuthedRoute) =>
  routes.map(({ subRoutes, ...restRouteProps }) =>
    subRoutes ? (
      <Route
        key={restRouteProps.path}
        path={restRouteProps.path}
        exact={isAuthedRoute}
        render={() => (
          <>
            <Route {...restRouteProps} />
            <AuthModalContainer parentRoute={restRouteProps.path}>
              <Switch>{renderRoutes(subRoutes, isAuthedRoute)}</Switch>
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

  const isAuthedRoute = useMemo(
    () => AUTHORIZED_ROUTES.some((route) => route === pathname),
    [pathname]
  );

  return <Switch>{renderRoutes(mainRoutes, isAuthedRoute)}</Switch>;
};

export default MainRoutes;
