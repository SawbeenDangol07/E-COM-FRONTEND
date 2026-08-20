import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "../pages/layout/RootLayout";
import ErrorPage from "../pages/ErrorPage";
import { publicRoutes } from "./publicRouter";
import { authRouter } from "./authRouter";
import { customerRoutes } from "./customerRouter";
import { sellerRoutes } from "./sellerRouter";
import { adminRoutes } from "./adminRouter";

const router = createBrowserRouter([
  // Main Customer Storefront Layout
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      ...publicRoutes,
    ],
  },
  // Dedicated Admin Portal
  ...adminRoutes,
  // Dedicated Seller Portal
  ...sellerRoutes,
  // Customer Profile Routes
  ...customerRoutes,
  // Auth Layout (Login, Register, Forgot Password)
  ...authRouter,
  // 404 Catch-all
  {
    path: "*",
    element: (
      <ErrorPage
        code={404}
        message="Page Not Found"
        redirectLink="/"
        redirectTxt="Back to Customer Storefront"
      />
    ),
  },
]);

export default function RouterConfig() {
  return <RouterProvider router={router} />;
}
