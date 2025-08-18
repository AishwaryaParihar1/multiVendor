import React, { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { User, Package, Plus, Receipt, LogOut } from "lucide-react";
import SweetAlertService from "../ui/SweetAlertService";  // Ensure correct path

const vendorMenu = [
  { name: "Profile", path: "/vendor/dashboard/profile", icon: <User size={20} /> },
  { name: "My Products", path: "/vendor/dashboard/products", icon: <Package size={20} /> },
  { name: "Add Product", path: "/vendor/dashboard/add-product", icon: <Plus size={20} /> },
  { name: "Order History", path: "/vendor/dashboard/orders", icon: <Receipt size={20} /> },
  { name: "Your Orders", path: "/vendor/dashboard/vendorOrdersPage", icon: <Receipt size={20} /> },
];

export default function VendorDashboard() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await SweetAlertService.showConfirm(
      "Are you sure?",
      "You will be logged out from the dashboard",
      "Logout",
      "Cancel"
    );
    if (confirmed) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`bg-secondary text-white shadow flex flex-col ${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b border-accent">
          {!collapsed && <span className="font-bold text-xl text-accent">Vendor Panel</span>}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Plus /> : <User />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {vendorMenu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                location.pathname === item.path
                  ? "bg-accent text-primary"
                  : "hover:bg-primary hover:text-white"
              }`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-md text-red-500 hover:bg-red-100 transition"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
