import api from "../services/api";

export const resetPassword = async ({ resetToken, password }) => {
  try {
    const { data } = await api.post(`/password-reset/${resetToken}`, {
      password,
    });

    return { data, error: null };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
