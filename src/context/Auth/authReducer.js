import * as types from "./authActionTypes";

export default (state, action) => {
  switch (action.type) {
    case types.SET_AUTH_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case types.AUTH_RESET:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
