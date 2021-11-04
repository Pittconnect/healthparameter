import React from "react";
import { Redirect } from "react-router";

import Route from "./state/types";
import MapPage from "../pages/Map/Map";
import NotFound from "../pages/NotFound/NotFound";

const authenticatedRoutes = [
  {
    path: Route.ROOT,
    component: MapPage,
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
