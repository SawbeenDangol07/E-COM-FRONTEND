import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../reducer/ProductReducer";
import chatReducer from "../reducer/ChatReducer";
import userReducer from "../reducer/UserReducer";

export const store = configureStore({
  reducer: {
    products: productReducer,
    chat: chatReducer,
    user: userReducer,
  },
});

export default store;
