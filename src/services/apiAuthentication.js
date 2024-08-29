import authAxios, { isLogin } from "../utils/axios";

export const login = async ({ username, password }) => {
  try {
    const response = await authAxios.post("/login", {
      username,
      password,
    });

    // Assuming the response contains the JWT token in response.data.jwt or response.data.data.accessToken
    console.log(response);
    const token =
      response.data.token ||
      response.data.jwt ||
      response.data.data.accessToken;
    if (token) {
      localStorage.setItem("admin-token", token);
    }

    return response.data;
  } catch (error) {
    throw error; // Re-throw the error if you need to handle it elsewhere
  }
};

export const signUp = async (credentials) => {
  try {
    const response = await authAxios.post("/register", credentials);

    // Assuming the response contains the JWT token in response.data.jwt or response.data.data.accessToken
    const token = response.data.jwt || response.data.data.accessToken;
    if (token) {
      localStorage.setItem("admin-token", token);
    }

    return response.data;
  } catch (error) {
    throw error; // Re-throw the error if you need to handle it elsewhere
  }
};

export async function getUserDetails() {
  try {
    if (!isLogin()) return null;
    const { data } = await authAxios.get("/auth/userdetail");
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
