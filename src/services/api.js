import axios from "axios";

const instance = axios.create({
  baseURL:
     // "http://localhost:9000/.netlify/functions/server/api/",
    "https://epic-kare-a20d74.netlify.app/.netlify/functions/server/api/",
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
