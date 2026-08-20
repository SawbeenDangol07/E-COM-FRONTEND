import AuthLayout from "../pages/layout/AuthLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import AccountActivationPage from "../pages/auth/AccountActivationPage";

export const authRouter = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "forgot-password", Component: ForgotPasswordPage },
      { path: "activate/:token", Component: AccountActivationPage },
    ],
  },
];

export default authRouter;
