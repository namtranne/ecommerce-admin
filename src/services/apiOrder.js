import authAxios, { isLogin } from "../utils/axios";

export const getAllOrders = async () => {
  const data = await authAxios.post("/admin/order", {});
  return data.data.orders;
};
