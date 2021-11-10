import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  responseType: "json",
});

instance.interceptors.request.use(
  (config) => {
    const item = window.localStorage.getItem("user_state");
    const token = item ? JSON.parse(item).token : "";

    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error.response);
  }
);

export default instance;
