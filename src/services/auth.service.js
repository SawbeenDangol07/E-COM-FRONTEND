import axiosInstance from "../config/axios.config";

class AuthService {
  async login(credentials) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getMe() {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      let payload;
      let headers = {};

      if (userData instanceof FormData) {
        payload = userData;
        headers["Content-Type"] = "multipart/form-data";
      } else if (userData.image && typeof userData.image !== "string") {
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
          if (userData[key] !== undefined && userData[key] !== null) {
            formData.append(key, userData[key]);
          }
        });
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = userData;
      }

      const response = await axiosInstance.post("/auth/register", payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      let payload;
      let headers = {};

      if (profileData instanceof FormData) {
        payload = profileData;
        headers["Content-Type"] = "multipart/form-data";
      } else if (profileData.image && typeof profileData.image !== "string") {
        const formData = new FormData();
        Object.keys(profileData).forEach((key) => {
          if (profileData[key] !== undefined && profileData[key] !== null) {
            formData.append(key, profileData[key]);
          }
        });
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        payload = profileData;
      }

      const response = await axiosInstance.patch("/auth/update-profile", payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async activate(token) {
    try {
      const response = await axiosInstance.get(`/auth/activate/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async reactivate(token) {
    try {
      const response = await axiosInstance.get(`/auth/reactivate/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
