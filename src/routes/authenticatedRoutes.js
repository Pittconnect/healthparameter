import React from "react";
import { Redirect } from "react-router-dom";

import Route from "./state/types";
import MapPage from "../pages/Map/Map";
import AdminPage from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";

const authenticatedRoutes = [
  {
    path: Route.MAP,
    component: MapPage,
  },
  {
    path: Route.ADMIN,
    component: AdminPage,
  },
  {
    path: Route.NOT_FOUND,
    component: NotFound,
    exact: true,
  },
  {
    path: Route.ALL,
    render: () => <Redirect to={Route.NOT_FOUND} />,
  },
];

export default authenticatedRoutes;
