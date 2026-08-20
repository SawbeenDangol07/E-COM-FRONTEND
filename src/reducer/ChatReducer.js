import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../services/chat.service";

export const fetchAllChats = createAsyncThunk(
  "chat/fetchAllChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.listUsers({ limit: 50 });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch chats");
    }
  },
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async ({ receiver, message }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage({ receiver, message });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send message");
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    setActiveChat(state, action) {
      state.activeChat = action.payload;
    },
    clearActiveChat(state) {
      state.activeChat = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
        if (!state.activeChat && action.payload.length > 0) {
          state.activeChat = action.payload[0];
        }
      })
      .addCase(fetchAllChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveChat, clearActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
