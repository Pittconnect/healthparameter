import Route from "./types";

export const PRIVATE_ROUTES = [Route.ADMIN, Route.MAP];
export const UNAUTHORIZED_ROUTES = [
  Route.LOGIN,
  Route.SIGNUP,
  Route.FORGOT,
  Route.CONFIRM_USER,
  Route.RESET_PASSWORD,
];
export const AUTHORIZED_ROUTES = [...PRIVATE_ROUTES, Route.NOT_FOUND];

export const ADMIN_ROUTES = [...PRIVATE_ROUTES];
export const VIP_ROUTES = [Route.MAP];
export const MEMBER_ROUTES = [Route.MAP];

export const RoleRoutes = {
  admin: ADMIN_ROUTES,
  vip: VIP_ROUTES,
  member: MEMBER_ROUTES,
};
