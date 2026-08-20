import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProductListPage from "../pages/products/ProductListPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import ProductCreatePage from "../pages/products/ProductCreatePage";
import CategoryListPage from "../pages/category/CategoryListPage";
import CategoryDetailPage from "../pages/category/CategoryDetailPage";
import PublicBrandListPage from "../pages/brands/PublicBrandListPage";
import BrandDetailPage from "../pages/brands/BrandDetailPage";
import ChatPage from "../pages/chat/ChatPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import OrderSuccessPage from "../pages/checkout/OrderSuccessPage";
import CustomerOrdersPage from "../pages/customer/CustomerOrdersPage";

export const publicRoutes = [
  { index: true, Component: HomePage },
  { path: "about", Component: AboutPage },
  { path: "products", Component: ProductListPage },
  { path: "products/:id", Component: ProductDetailPage },
  { path: "products/create", Component: ProductCreatePage },
  { path: "categories", Component: CategoryListPage },
  { path: "category", Component: CategoryListPage },
  { path: "category/:slug", Component: CategoryDetailPage },
  { path: "brands", Component: PublicBrandListPage },
  { path: "brand", Component: PublicBrandListPage },
  { path: "brand/:slug", Component: BrandDetailPage },
  { path: "chat", Component: ChatPage },
  { path: "checkout", Component: CheckoutPage },
  { path: "checkout/success", Component: OrderSuccessPage },
  { path: "orders", Component: CustomerOrdersPage },
  { path: "my-orders", Component: CustomerOrdersPage },
];

export default publicRoutes;
