import RootLayout from "../pages/layout/RootLayout";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ErrorPage from "../pages/ErrorPage";

export const customerRoutes = [
  {
    path: "/customer",
    element: <RootLayout />,
    children: [
      { path: "dashboard", element: <CustomerDashboard /> },
      { index: true, element: <CustomerDashboard /> },
      {
        path: "*",
        element: (
          <ErrorPage
            code={404}
            redirectLink="/"
            redirectTxt="Go Back to Marketplace"
          />
        ),
      },
    ],
  },
];

export default customerRoutes;
