import api from "../services/api";

export const signupUser = async ({ username, email, password }) => {
  try {
    const { data } = await api.post("/register", {
      username,
      email,
      password,
    });

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
