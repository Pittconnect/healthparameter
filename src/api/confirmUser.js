import api from "../services/api";

export const confirmUser = async ({ confirmationCode }) => {
  try {
    const { data } = await api.get(`/confirm/${confirmationCode}`);

    return { data, error: null };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
