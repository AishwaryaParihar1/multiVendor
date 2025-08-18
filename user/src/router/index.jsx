import LayoutWrapper from "../components/LayoutWrapper";  // naya component for layout handling
import AdminLayout from "../components/admin/AdminLayout";
import VendorApprovalPage from "../components/admin/VendorApprovalPage";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserDashboard from "../pages/UserDashboard";
import VendorDashboard from "../components/vendor/VendorDashboard";
import Dashboard from "../components/admin/Dashboard";
import Vendors from "../components/admin/Vendors";
import VendorProfile from "../components/vendor/VendorProfile";
import AddProductPage from "../components/vendor/AddProductPage";
import MyProduct from "../components/vendor/MyProduct";
import EditProductPage from "../components/vendor/EditProductPage";
import PrivateRoute from "../components/PrivateRoute";
import HomePage from "../components/coustomer/HomePage";
import Profile from "../components/coustomer/Profile";
import CategoryManager from "../components/admin/CategoryManager";
import WishlistPage from "../components/coustomer/WishlistPage";
import CartPage from "../components/coustomer/CartPage";
import CheckoutPage from "../components/coustomer/CheckoutPage";
import VendorOrdersPage from "../components/vendor/VendorOrdersPage";
import AdminOrderPage from "../components/admin/AdminOrderPage";
import MyOrdersPage from "../components/coustomer/MyOrdersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWrapper />,  
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },

      // Add these routes for direct access:
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkoutPage", element: <CheckoutPage /> },
       { path: "/my-orders", element: <MyOrdersPage /> },

      // Profile (if needed, keep as nested):
      {
        path: "user/profile",
        element: (
          <PrivateRoute allowedRoles={["customer"]}>
            <Profile />
          </PrivateRoute>
        ),
        // Children can be empty or as you need
      },

,
      {
        path: "vendor/dashboard",
        element: (
          <PrivateRoute allowedRoles={["vendor"]}>
            <VendorDashboard />
          </PrivateRoute>
        ),
        children: [
          { path: "profile", element: <VendorProfile /> },
          { path: "products", element: <MyProduct /> },
          { path: "add-product", element: <AddProductPage /> },
          { path: "vendorOrdersPage", element: <VendorOrdersPage /> },
          { path: "edit-product/:id", element: <EditProductPage /> },
          // { path: "orders", element: <VendorOrders /> },
        ],
      },
      {
        path: "admin/dashboard",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        ),
        children: [
          { path: "", element: <Dashboard /> }, // default admin page
          { path: "vendorApprovalPage", element: <VendorApprovalPage /> },
          { path: "vendors", element: <Vendors /> },
          { path: "categoryManager", element: <CategoryManager /> },
          { path: "adminOrderPage", element: <AdminOrderPage /> },
        ],
      },

      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
