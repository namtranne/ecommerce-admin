import axios from "axios";

export const getToken = () => {
  return localStorage.getItem("admin-token")
    ? localStorage.getItem("admin-token")
    : "";
};

export const isLogin = () => {
  return localStorage.getItem("admin-token") ? true : false;
};

const authAxios = axios.create({
  baseURL: "https://spring-deploy-9mhk.onrender.com/api",
});

authAxios.interceptors.request.use((config) => {
  // Check if the Authorization header is not already set
  if (!config.headers.Authorization) {
    const token = getToken();
    if (token !== "") {
      // Add the Authorization header with a Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Return the modified config object
  return config;
});

export default authAxios;
