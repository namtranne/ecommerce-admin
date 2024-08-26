import authAxios, { isLogin } from "../utils/axios";

export const getAllOrders = async () => {
  const data = await authAxios.get("/admin/order");
  return data.data.orders;
};
