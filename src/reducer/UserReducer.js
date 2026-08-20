import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../services/chat.service";

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await chatService.listUsers({
        search: params.search || "",
        limit: 50,
      });
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    activeUser: null,
    allUserList: [],
    loading: false,
    error: null,
  },
  reducers: {
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },
    clearActiveUser: (state) => {
      state.activeUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUserList = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveUser, clearActiveUser } = userSlice.actions;
export default userSlice.reducer;
