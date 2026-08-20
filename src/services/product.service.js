import axiosInstance from "../config/axios.config";

class ProductService {
  async listAll({ page = 1, limit = 20, search = "", status = "" } = {}) {
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.search = search.trim();
      }
      if (status) {
        params.status = status;
      }
      const response = await axiosInstance.get("/product", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listPublic({
    page = 1,
    limit = 100,
    search = "",
    brand = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    sortBy = "",
  } = {}) {
    try {
      const params = { page, limit };
      if (search && search.trim()) params.search = search.trim();
      if (brand && brand !== "all") params.brand = brand;
      if (category && category !== "all") params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;

      const response = await axiosInstance.get("/product/get-all", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDetail(id) {
    try {
      const response = await axiosInstance.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getBySlug(slug) {
    try {
      const response = await axiosInstance.get(`/product/${slug}/detail`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async create(productData) {
    try {
      let payload;
      let headers = {};

      if (productData instanceof FormData) {
        payload = productData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("discount", productData.discount || 0);
        formData.append("description", productData.description);
        formData.append("status", productData.status || "active");
        formData.append("stock", productData.stock || 0);

        if (productData.sku) {
          formData.append("sku", productData.sku);
        }

        if (productData.brand && productData.brand !== "null" && productData.brand !== "") {
          formData.append("brand", productData.brand);
        }

        if (Array.isArray(productData.category)) {
          productData.category.forEach((catId, index) => {
            if (catId) {
              formData.append(`category[${index}]`, catId);
            }
          });
        } else if (productData.category) {
          formData.append("category[0]", productData.category);
        }

        if (Array.isArray(productData.images)) {
          productData.images.forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        } else if (productData.images instanceof File) {
          formData.append("images", productData.images);
        }

        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.post("/product", payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async update(id, productData) {
    try {
      let payload;
      let headers = {};

      if (productData instanceof FormData) {
        payload = productData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("price", productData.price);
        formData.append("discount", productData.discount !== undefined ? productData.discount : 0);
        formData.append("description", productData.description);
        formData.append("status", productData.status || "active");
        formData.append("stock", productData.stock || 0);

        if (productData.sku) {
          formData.append("sku", productData.sku);
        }

        if (productData.brand && productData.brand !== "null" && productData.brand !== "") {
          formData.append("brand", productData.brand);
        } else {
          formData.append("brand", "");
        }

        if (Array.isArray(productData.category)) {
          productData.category.forEach((catId, index) => {
            if (catId) {
              formData.append(`category[${index}]`, catId);
            }
          });
        } else if (productData.category) {
          formData.append("category[0]", productData.category);
        }

        if (Array.isArray(productData.images)) {
          productData.images.forEach((file) => {
            if (file instanceof File) {
              formData.append("images", file);
            }
          });
        } else if (productData.images instanceof File) {
          formData.append("images", productData.images);
        }

        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axiosInstance.put(`/product/${id}`, payload, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await axiosInstance.delete(`/product/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const productService = new ProductService();
export default productService;
