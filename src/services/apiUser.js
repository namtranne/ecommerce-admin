import authAxios, { isLogin } from "../utils/axios";

export async function getUsers() {
  try {
    if (!isLogin()) return null;
    const { data } = await authAxios.get("/admin/user");
    return data.users;
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
