import React from "react";
import { Link } from "react-router-dom";

import { useUserData } from "../../hooks";

const NotFound = () => {
  const { homeUrl } = useUserData();

  return (
    <div
      className="not-found-page uk-flex uk-flex-1 uk-flex-column uk-flex-middle uk-flex-center uk-light"
      uk-height-viewport=""
    >
      <h2 className="">Page Not Found</h2>

      <Link className="uk-text-background" to={homeUrl ?? "#"}>
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
