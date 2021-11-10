import api from "../services/api";

export const createOrder = async ({ email, price }) => {
  try {
    const { data } = await api.post("/create-order", {
      email,
      price,
    });

    return { data, error: null };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};

export const captureOrder = async (orderProps) => {
  try {
    const { data } = await api.post("/capture-order", {
      ...orderProps,
    });

    return { data, error: null };
  } catch ({ data }) {
    return { data, error: data.msg };
  }
};
