import axiosInstance from "../config/axios.config";

class BrandService {
  async listAll({ page = 1, limit = 20, search = "", status = "" } = {}) {
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }
      if (status) {
        params.status = status;
      }
      const response = await axiosInstance.get("/brand", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDetail(id) {
    try {
      const response = await axiosInstance.get(`/brand/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async create(brandData) {
    try {
      let payload;
      let headers = {};

      if (brandData instanceof FormData) {
        payload = brandData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("name", brandData.name);
        formData.append("status", brandData.status || "active");
        if (brandData.logo instanceof File) {
          formData.append("logo", brandData.logo);
        }
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.post("/brand", payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, brandData) {
    try {
      let payload;
      let headers = {};

      if (brandData instanceof FormData) {
        payload = brandData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("name", brandData.name);
        formData.append("status", brandData.status || "active");
        if (brandData.logo instanceof File) {
          formData.append("logo", brandData.logo);
        }
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.put(`/brand/${id}`, payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/brand/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBySlug(slug, { page = 1, limit = 20 } = {}) {
    try {
      const response = await axiosInstance.get(`/brand/slug/${slug}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const brandService = new BrandService();
export default brandService;
