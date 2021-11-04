const Route = {
  ROOT: "/",

  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT: "/forgot",
  CONFIRM_USER: "/confirm/:confirmationCode",
  RESET_PASSWORD: "/password-reset/:resetToken",

  ABOUT: "/about",
  MAP: "/map",

  NOT_FOUND: "/page-not-found",
  ALL: "*",
};

export default Route;
