import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "./config/store";
import AuthProvider from "./context/providers/AuthProvider";
import CartProvider from "./context/providers/CartProvider";
import RouterConfig from "./router/RouterConfig";
import "./assets/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <Toaster
            richColors
            closeButton
            position="bottom-left"
            theme="light"
          />
          <RouterConfig />
        </CartProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
