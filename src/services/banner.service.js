import axiosInstance from "../config/axios.config";

class BannerService {
  async listAll({ page = 1, limit = 20, search = "", status = "" } = {}) {
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.q = search.trim();
      }
      if (status) {
        params.status = status;
      }
      const response = await axiosInstance.get("/banner", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listForHome() {
    try {
      const response = await axiosInstance.get("/banner/home");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDetail(id) {
    try {
      const response = await axiosInstance.get(`/banner/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async create(bannerData) {
    try {
      let payload;
      let headers = {};

      if (bannerData instanceof FormData) {
        payload = bannerData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("title", bannerData.title);
        formData.append("url", bannerData.url);
        formData.append("status", bannerData.status || "active");
        if (bannerData.image instanceof File) {
          formData.append("image", bannerData.image);
        }
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.post("/banner", payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, bannerData) {
    try {
      let payload;
      let headers = {};

      if (bannerData instanceof FormData) {
        payload = bannerData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("title", bannerData.title);
        formData.append("url", bannerData.url);
        formData.append("status", bannerData.status || "active");
        if (bannerData.image instanceof File) {
          formData.append("image", bannerData.image);
        }
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.put(`/banner/${id}`, payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/banner/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const bannerService = new BannerService();
export default bannerService;
