import api from "../services/api";

export const loginUser = async ({ username, password }) => {
  try {
    const { data } = await api.post("/login", {
      username,
      password,
    });

    return { data, error: null };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
