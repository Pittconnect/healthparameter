import React from "react";

import UsersDetails from "./components/UsersDetails";
import UserCreate from "./components/UserCreate";

import "./Admin.scss";

const Admin = () => {
  return (
    <div className="admin-page uk-padding-small uk-margin-medium-top">
      <div
        className="uk-grid-column-collapse uk-grid-row-small uk-child-width-1-1"
        uk-grid=""
      >
        <UsersDetails />

        <UserCreate />
      </div>
    </div>
  );
};

export default Admin;
