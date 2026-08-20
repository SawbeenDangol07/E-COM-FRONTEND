import axiosInstance from "../config/axios.config";

class CategoryService {
  async listAll() {
    try {
      const response = await axiosInstance.get("/category");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listForHome() {
    try {
      const response = await axiosInstance.get("/category/for-home");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDetail(id) {
    try {
      const response = await axiosInstance.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBySlug(slug, { page = 1, limit = 20 } = {}) {
    try {
      const response = await axiosInstance.get(`/category/${slug}/detail`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async create(categoryData) {
    try {
      let payload;
      let headers = {};

      if (categoryData instanceof FormData) {
        payload = categoryData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("name", categoryData.name);
        formData.append("status", categoryData.status || "active");

        if (categoryData.parent && categoryData.parent !== "null" && categoryData.parent !== "") {
          formData.append("parent", categoryData.parent);
        } else {
          formData.append("parent", "");
        }

        if (Array.isArray(categoryData.brands)) {
          categoryData.brands.forEach((brandId, index) => {
            if (brandId) {
              formData.append(`brands[${index}]`, brandId);
            }
          });
        } else if (categoryData.brands) {
          formData.append("brands", categoryData.brands);
        }

        if (categoryData.image instanceof File) {
          formData.append("image", categoryData.image);
        }
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.post("/category", payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, categoryData) {
    try {
      let payload;
      let headers = {};

      if (categoryData instanceof FormData) {
        payload = categoryData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("name", categoryData.name);
        formData.append("status", categoryData.status || "active");

        if (categoryData.parent && categoryData.parent !== "null" && categoryData.parent !== "") {
          formData.append("parent", categoryData.parent);
        } else {
          formData.append("parent", "");
        }

        if (Array.isArray(categoryData.brands)) {
          categoryData.brands.forEach((brandId, index) => {
            if (brandId) {
              formData.append(`brands[${index}]`, brandId);
            }
          });
        } else if (categoryData.brands) {
          formData.append("brands", categoryData.brands);
        }

        if (categoryData.image instanceof File) {
          formData.append("image", categoryData.image);
        }
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.put(`/category/${id}`, payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/category/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;
