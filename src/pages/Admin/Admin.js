import React from "react";

import UsersTable from "./components/UsersTable";

import "./Admin.scss";

const Admin = () => {
  return (
    <div className="admin-page uk-padding-small uk-margin-medium-top">
      <UsersTable />
    </div>
  );
};

export default Admin;
