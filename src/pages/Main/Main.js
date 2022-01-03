import React, { useContext } from "react";

import { UserContext } from "../../context/User/userContext";
import { useUserData } from "../../hooks";
import AuthenticatedRoutes from "../../routes/components/AuthenticatedRoutes";
import LoadingContainer from "../../components/common/LoadingContainer/LoadingContainer";

// import { useHistory } from "react-router";
// import UIkit from "uikit";
// import Route from "../../routes/state/types";
// import { useVerifyData } from "./hooks/useVerifyData";

import "./Main.scss";

const MainPage = () => {
  const {
    state: { me, loading },
  } = useContext(UserContext);
  const { isLoggedIn, logout } = useUserData();
  const { username } = me;

  // const history = useHistory();
  // const { verify, loading, error } = useVerifyData();

  // useLayoutEffect(() => {
  //   if (isLoggedIn) {
  //     verify();
  //   }
  // }, [verify, isLoggedIn]);

  // useEffect(() => {
  //   if (error) {
  //     UIkit.notification({
  //       message: error,
  //       status: "danger",
  //       pos: "top-right",
  //       timeout: 5000,
  //     });

  //     setUserLocalState(initialState.user);
  //     history.push(Route.ROOT);
  //   }
  // }, [error, history, setUserLocalState]);

  return (
    <LoadingContainer loading={loading}>
      <div className="covid-map uk-overflow-auto uk-height-1-1">
        <div className="map-panel uk-position-absolute uk-position-z-index uk-width-auto uk-position-top-right uk-flex uk-flex-middle uk-tile uk-tile-muted uk-text-secondary uk-border-pill ">
          <div className="uk-text-default">{username}</div>
          <span className="signout-icon uk-iconnav" onClick={logout}>
            <span uk-icon="icon: sign-out; ratio: 1.25" />
          </span>
        </div>
        {isLoggedIn && <AuthenticatedRoutes />}
      </div>
    </LoadingContainer>
  );
};

export default MainPage;
