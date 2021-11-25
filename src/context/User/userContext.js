import React, {
  createContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";

import * as types from "./userActionTypes";
import userReducer from "./userReducer";
import { useUserData } from "../../hooks";
import {
  removeUser,
  fetchUsers,
  updateUsers,
  fetchLoggedInUser,
} from "../../api/user";

const initialUserState = {
  loading: false,
  loadingText: "",
  error: null,
  users: [],
  user: null,
  me: {
    username: "",
    location: "",
  },
  errResponse: "",
  message: null,
};

export const UserContext = createContext(initialUserState);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const { isLoggedIn } = useUserData();

  const getLoggedInUser = useCallback(async () => {
    dispatch({
      type: types.LOADING_START,
      payload: "Loading user",
    });

    const { data, error } = await fetchLoggedInUser();

    if (error) {
      dispatch({
        type: types.LOADING_FAILURE,
        payload: error,
      });

      return;
    }

    dispatch({
      type: types.GET_LOGGED_IN_USER,
      payload: data.user,
    });
  }, []);

  const getUsers = useCallback(async () => {
    dispatch({
      type: types.LOADING_START,
      payload: "Loading users",
    });

    const { data, error } = await fetchUsers();

    if (error) {
      dispatch({
        type: types.LOADING_FAILURE,
        payload: error,
      });

      return;
    }

    dispatch({
      type: types.LOADING_SUCCESS,
      payload: data.users,
    });
  }, []);

  const editUsers = useCallback(async (modifiedUsers) => {
    dispatch({
      type: types.LOADING_START,
      payload: "Updating users",
    });

    const { data, error } = await updateUsers(modifiedUsers);

    if (error) {
      dispatch({
        type: types.LOADING_FAILURE,
        payload: error,
      });

      return;
    }

    dispatch({
      type: types.LOADING_SUCCESS,
      payload: data.users,
    });
  }, []);

  const deleteUser = useCallback(async (userId) => {
    dispatch({
      type: types.LOADING_START,
      payload: "Deleting user",
    });

    const { /* data, */ error } = await removeUser(userId);

    if (error) {
      dispatch({
        type: types.LOADING_FAILURE,
        payload: error,
      });

      return;
    }

    dispatch({
      type: types.DELETE_USER,
      payload: userId,
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    getLoggedInUser();
    getUsers();
  }, [isLoggedIn, getLoggedInUser, getUsers]);

  return (
    <UserContext.Provider
      value={{
        state,

        editUsers,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
