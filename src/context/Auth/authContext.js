import React, { createContext, useReducer, useCallback } from "react";

import * as types from "./authActionTypes";
import authReducer from "./authReducer";
import Route from "../../routes/state/types";
import { useLocalStorage } from "../../hooks";

const initialAuthData = {
  token: null,
  permissions: [],
  homeUrl: Route.ROOT,
};

const initialAuthState = {
  loading: false,
  error: false,
  errResponse: null,
  ...initialAuthData,
};

export const AuthContext = createContext(initialAuthState);

export const AuthProvider = ({ children }) => {
  const [userLocal, setUserLocal, removeUserLocal] = useLocalStorage(
    "user_state",
    ""
  );
  const [state, dispatch] = useReducer(authReducer, {
    ...initialAuthState,
    ...userLocal,
  });

  const setAuthData = useCallback(
    (authState) => {
      dispatch({
        type: types.SET_AUTH_DATA,
        payload: authState,
      });

      setUserLocal({ ...authState });
    },
    [setUserLocal]
  );

  const authReset = useCallback(() => {
    dispatch({
      type: types.AUTH_RESET,
      payload: initialAuthState,
    });

    removeUserLocal();
  }, [removeUserLocal]);

  return (
    <AuthContext.Provider
      value={{
        state,

        authReset,
        setAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
