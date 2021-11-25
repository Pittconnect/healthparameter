import { useCallback, useContext, useMemo } from "react";
import decode from "jwt-decode";

import { AuthContext } from "../context/Auth/authContext";
import { RoleRoutes } from "../routes/state/constants";
import { isRoute } from "../utils";

export const useUserData = () => {
  const { state, authReset } = useContext(AuthContext);

  const decodedToken = useMemo(() => {
    try {
      return decode(state.token);
    } catch (error) {
      return null;
    }
  }, [state.token]);

  const isLoggedIn = useMemo(() => {
    if (!decodedToken) return false;

    const { exp } = decodedToken;
    const isTokenExpired = exp > Math.floor(Date.now() / 1000);

    return isTokenExpired;
  }, [decodedToken]);

  const permissions = useMemo(() => {
    if (!decodedToken) return [];

    const { role } = decodedToken;

    return RoleRoutes[role];
  }, [decodedToken]);

  const logout = useCallback(authReset, [authReset]);

  const hasRoutePermissions = (route) =>
    permissions.some((item) => isRoute(route, item));

  return {
    ...state,
    isLoggedIn,

    logout,
    hasRoutePermissions,
  };
};
