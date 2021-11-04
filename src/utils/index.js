import { matchPath } from "react-router";

const isRouteMatch = (path, route) =>
  !!matchPath(path, {
    path: route.path ?? route,
    exact: route.exact ?? undefined,
    strict: false,
  });

export const isRoute = (route, customRoute) => {
  const routeToMatch = customRoute ?? window.location.pathname;

  if (Array.isArray(route)) {
    return route.some((item) => isRouteMatch(routeToMatch, item));
  }

  return isRouteMatch(routeToMatch, route);
};
