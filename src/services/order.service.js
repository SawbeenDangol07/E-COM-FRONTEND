import axiosInstance from "../config/axios.config";

class OrderService {
  async addToCart({ product, quantity = 1 }) {
    try {
      const response = await axiosInstance.post("/order/add-to-cart", {
        product,
        quantity: Number(quantity),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCart() {
    try {
      const response = await axiosInstance.get("/order/get-cart");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, { product, quantity }) {
    try {
      const response = await axiosInstance.patch(`/order/cart-update/${cartId}`, {
        product,
        quantity: Number(quantity),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async checkout({ cartId, discount = 0 }) {
    try {
      const response = await axiosInstance.post("/order/checkout", {
        cartId,
        discount: Number(discount),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listOrders({ page = 1, limit = 20, status = "" } = {}) {
    try {
      const params = { page, limit };
      if (status) {
        params.status = status;
      }
      const response = await axiosInstance.get("/order/order-list", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async initiatePayment({ orderId, method = "khalti" }) {
    try {
      const response = await axiosInstance.post("/order/khalti-pay", {
        orderId,
        method,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const orderService = new OrderService();
export default orderService;
