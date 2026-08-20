import UserLayout from "../pages/layout/UserLayout";
import SellerDashboard from "../pages/seller/SellerDashboard";
import AdminProductListPage from "../pages/products/AdminProductListPage";
import SellerOrdersPage from "../pages/seller/SellerOrdersPage";
import ProductCreatePage from "../pages/products/ProductCreatePage";
import ProductEditPage from "../pages/products/ProductEditPage";
import BrandListPage from "../pages/brands/BrandListPage";
import BrandCreatePage from "../pages/brands/BrandCreatePage";
import BrandEditPage from "../pages/brands/BrandEditPage";
import CategoryListPage from "../pages/categories/CategoryListPage";
import CategoryCreatePage from "../pages/categories/CategoryCreatePage";
import CategoryEditPage from "../pages/categories/CategoryEditPage";
import ChatPage from "../pages/chat/ChatPage";
import ErrorPage from "../pages/ErrorPage";

export const sellerRoutes = [
  {
    path: "/seller",
    element: <UserLayout />,
    children: [
      { index: true, Component: SellerDashboard },
      { path: "products", element: <AdminProductListPage /> },
      { path: "product", element: <AdminProductListPage /> },
      { path: "products/create", element: <ProductCreatePage /> },
      { path: "product/create", element: <ProductCreatePage /> },
      { path: "products/:id", element: <ProductEditPage /> },
      { path: "product/:id", element: <ProductEditPage /> },
      { path: "brands", element: <BrandListPage /> },
      { path: "brand", element: <BrandListPage /> },
      { path: "brand/create", element: <BrandCreatePage /> },
      { path: "brands/create", element: <BrandCreatePage /> },
      { path: "brand/:id", element: <BrandEditPage /> },
      { path: "brands/:id", element: <BrandEditPage /> },
      { path: "categories", element: <CategoryListPage /> },
      { path: "category", element: <CategoryListPage /> },
      { path: "category/create", element: <CategoryCreatePage /> },
      { path: "categories/create", element: <CategoryCreatePage /> },
      { path: "category/:id", element: <CategoryEditPage /> },
      { path: "categories/:id", element: <CategoryEditPage /> },
      { path: "orders", element: <SellerOrdersPage /> },
      { path: "messages", element: <ChatPage /> },
      {
        path: "*",
        element: (
          <ErrorPage
            code={404}
            redirectLink="/seller"
            redirectTxt="Go Back to Seller Dashboard"
          />
        ),
      },
    ],
  },
];

export default sellerRoutes;
