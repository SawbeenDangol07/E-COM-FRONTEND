import UserLayout from "../pages/layout/UserLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductListPage from "../pages/products/AdminProductListPage";
import ProductCreatePage from "../pages/products/ProductCreatePage";
import ProductEditPage from "../pages/products/ProductEditPage";
import BrandListPage from "../pages/brands/BrandListPage";
import BrandCreatePage from "../pages/brands/BrandCreatePage";
import BrandEditPage from "../pages/brands/BrandEditPage";
import CategoryListPage from "../pages/categories/CategoryListPage";
import CategoryCreatePage from "../pages/categories/CategoryCreatePage";
import CategoryEditPage from "../pages/categories/CategoryEditPage";
import BannerListPage from "../pages/banners/BannerListPage";
import BannerCreatePage from "../pages/banners/BannerCreatePage";
import BannerEditPage from "../pages/banners/BannerEditPage";
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import ChatPage from "../pages/chat/ChatPage";
import ErrorPage from "../pages/ErrorPage";

export const adminRoutes = [
  {
    path: "/admin",
    element: <UserLayout />,
    children: [
      { index: true, Component: AdminDashboard },
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
      { path: "banners", element: <BannerListPage /> },
      { path: "banner", element: <BannerListPage /> },
      { path: "banner/create", element: <BannerCreatePage /> },
      { path: "banners/create", element: <BannerCreatePage /> },
      { path: "banner/:id", element: <BannerEditPage /> },
      { path: "banners/:id", element: <BannerEditPage /> },
      { path: "users", element: <AdminUserListPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "messages", element: <ChatPage /> },
      {
        path: "*",
        element: (
          <ErrorPage
            code={404}
            redirectLink="/admin"
            redirectTxt="Go Back to Admin Dashboard"
          />
        ),
      },
    ],
  },
];

export default adminRoutes;
