import api from "../services/api";

export const fetchUsers = async () => {
  try {
    const { data } = await api.get("/");

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};

export const fetchLoggedInUser = async () => {
  try {
    const { data } = await api.get("/me");

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};

export const updateUsers = async (modifiedUsers) => {
  try {
    const { data } = await api.patch("/edit-users", { modifiedUsers });

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};

export const removeUser = async (userId) => {
  try {
    const { data } = await api.get(`/delete/${userId}`);

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await api.post("/create", { ...userData });

    return { data, error: data.success ? null : data.msg };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
