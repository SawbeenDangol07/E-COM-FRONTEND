import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9005/api/v1",
  timeout: 15000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is invalid or unauthorized, optional cleanup
    if (error.response && error.response.status === 401) {
      const isAuthPath =
        error.config.url?.includes("/auth/login") ||
        error.config.url?.includes("/auth/register") ||
        error.config.url?.includes("/auth/activate");
      if (!isAuthPath) {
        Cookies.remove("token");
        localStorage.removeItem("mobimarket_user");
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    const customError = new Error(message);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.data = error.response?.data;

    return Promise.reject(customError);
  }
);

export default axiosInstance;
