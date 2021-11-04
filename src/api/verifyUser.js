import api from "../services/api";

export const verifyUser = async () => {
  try {
    const { data } = await api.get("/protected");

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data: { success: false }, error: "Unauthorized access" };
  }
};
