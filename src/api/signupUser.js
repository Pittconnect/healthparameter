import api from "../services/api";

export const signupUser = async ({ username, email, password, payment }) => {
  try {
    const { data } = await api.post("/register", {
      username,
      email,
      password,
      payment,
    });

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
