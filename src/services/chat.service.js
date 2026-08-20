import axiosInstance from "../config/axios.config";

class ChatService {
  async listUsers({ page = 1, limit = 50, search = "" } = {}) {
    try {
      const params = { page, limit };
      if (search && search.trim()) {
        params.q = search.trim();
      }
      const response = await axiosInstance.get("/chat/list-users", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getChatDetail(userId, { page = 1, limit = 100 } = {}) {
    try {
      const response = await axiosInstance.get(`/chat/detail/${userId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage({ receiver, message }) {
    try {
      const response = await axiosInstance.post("/chat/send-message", {
        receiver,
        message: message.trim(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(chatId) {
    try {
      const response = await axiosInstance.delete(`/chat/message/${chatId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async clearConversation(userId) {
    try {
      const response = await axiosInstance.delete(`/chat/conversation/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
