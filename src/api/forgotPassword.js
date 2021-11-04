import api from "../services/api";

export const forgotPassword = async ({ email }) => {
  try {
    const { data } = await api.post("/password-reset", {
      email,
    });

    return { data, error: null };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
