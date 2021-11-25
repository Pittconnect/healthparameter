import * as types from "./userActionTypes";

export default (state, action) => {
  switch (action.type) {
    case types.LOADING_START:
      return {
        ...state,
        loading: true,
        loadingText: action.payload,
        message: null,
        user: null,
        error: null,
      };

    case types.LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingText: "",
        users: action.payload,
      };

    // case types.GET_USER:
    //   return {
    //     ...state,
    //     loading: false,
    //     loadingText: "",
    //     user: action.payload,
    //     error: null,
    //     errResponse: "",
    //   };

    case types.GET_LOGGED_IN_USER:
      return {
        ...state,
        loading: false,
        loadingText: "",
        me: action.payload,
      };

    case types.DELETE_USER:
      return {
        ...state,
        users: [...state.users.filter(({ _id }) => _id !== action.payload)],
        loading: false,
        loadingText: "",
        error: false,
        errResponse: "",
        user: null,
        message: "Deleted successfully",
      };

    case types.LOADING_FAILURE:
      return {
        ...state,
        loading: false,
        loadingText: "",
        error: true,
        errResponse: action.payload,
      };

    // case types.SET_USERS:
    //   return {
    //     ...state,
    //     users: action.payload,
    //   };

    // case types.RESET_STATE:
    //   return {
    //     ...action.payload,
    //   };

    default:
      return state;
  }
};
