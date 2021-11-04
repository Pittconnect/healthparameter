import React from "react";

import Route from "./state/types";
import LoginPage from "../pages/Login/Login";
import SignupPage from "../pages/SignUp/SignUp";
import ForgotPage from "../pages/Forgot/Forgot";
import MainPage from "../pages/Main/Main";
import HomePage from "../pages/Home/Home";
import ConfirmUser from "../pages/ConfirmUser/ConfirmUser";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

const AboutPage = () => {
  return <div>About</div>;
};

const mainRoutes = [
  {
    path: Route.ROOT,
    component: HomePage,
    subRoutes: [
      {
        path: Route.LOGIN,
        component: LoginPage,
      },
      {
        path: Route.SIGNUP,
        component: SignupPage,
      },
      {
        path: Route.FORGOT,
        component: ForgotPage,
      },
      {
        path: Route.CONFIRM_USER,
        component: ConfirmUser,
      },
      {
        path: Route.RESET_PASSWORD,
        component: ResetPassword,
      },
    ],
  },
  {
    path: Route.MAP,
    component: MainPage,
  },
  {
    path: "/about",
    component: AboutPage,
  },
];

export default mainRoutes;
