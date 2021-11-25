import api from "../services/api";

export const editUser = async ({ location, role }) => {
  try {
    const { data } = await api.post("/edit-user", {
      location,
      role,
    });

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
