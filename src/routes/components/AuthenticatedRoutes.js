import React from "react";
import { Route, Switch } from "react-router-dom";

import authenticatedRoutes from "../authenticatedRoutes";

const renderRoutes = authenticatedRoutes.map((route) => (
  <Route key={route.path} {...route} />
));

const AuthenticatedRoutes = () => <Switch>{renderRoutes}</Switch>;

export default AuthenticatedRoutes;
