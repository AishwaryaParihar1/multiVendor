import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper() {
  const location = useLocation();

  // Pages where Navbar/Footer should be hidden
  const hideLayoutPaths = [
    "/login",
    "/register",
  ];

  // Admin/vendor routes to hide layout
  const isAdminOrVendorRoute =
    location.pathname.startsWith("/admin/dashboard") ||
    location.pathname.startsWith("/vendor/dashboard");

  // Check if current path is in pages to hide navbar/footer
  const isAuthPage = hideLayoutPaths.includes(location.pathname);

  // Show Navbar/Footer on home ('/') and all except login/register/admin/vendor
  if (isAdminOrVendorRoute || isAuthPage) {
    return <Outlet />;
  }

  // Show Navbar/Footer on home and normal pages
   return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main style={{ flexGrow: 1 /* navbar ki height */ }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
