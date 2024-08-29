import authAxios, { isLogin } from "../utils/axios";

export const getAllOrders = async (userId) => {
  const data = await authAxios.post("/admin/order", { userId });
  return data.data.orders;
};
