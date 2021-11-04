import Route from "./types";

export const UNAUTHORIZED_ROUTES = [
  Route.LOGIN,
  Route.SIGNUP,
  Route.FORGOT,
  Route.CONFIRM_USER,
  Route.RESET_PASSWORD,
];
export const SEC_UNAUTHORIZED_ROUTES = [Route.MAP, Route.ABOUT];
