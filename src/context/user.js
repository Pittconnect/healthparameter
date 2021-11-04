import React, { createContext, useCallback, useState } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import Route from "../routes/state/types";

export const initialState = {
  user: {
    username: undefined,
    token: undefined,
    homeUrl: Route.ROOT,
    expiresIn: undefined,
  },
  setUserData: () => {},
  clearUserData: () => {},
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [userLocalState, setUserLocalState] = useLocalStorage("user_state", "");
  const [user, setUser] = useState(userLocalState || initialState.user);

  const setUserData = (userState) => {
    setUser(userState);

    setUserLocalState(userState);
  };

  const clearUserData = useCallback(() => {
    console.log("CLEAR USER DATA");
    setUser(initialState.user);

    setUserLocalState(initialState.user);
  }, [setUserLocalState]);

  return (
    <UserContext.Provider value={{ user, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
};
