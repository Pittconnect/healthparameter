const Route = {
  ROOT: "/",
  MAIN: "/*",

  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT: "/forgot",
  CONFIRM_USER: "/confirm/:confirmationCode",
  RESET_PASSWORD: "/password-reset/:resetToken",

  ABOUT: "/about",

  MAP: "/map",
  ADMIN: "/admin",

  NOT_FOUND: "/page-not-found",
  ALL: "*",
};

export default Route;
