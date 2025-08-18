import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LogOut, ClipboardList, PenSquare, Images, ChevronLeft, ChevronRight } from "lucide-react";
import SweetAlertService from "../ui/SweetAlertService";

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const menuItems = [
    { name: "dashboard", path: "/admin/dashboard", icon: <ClipboardList size={20} /> },
    { name: "vendorApprovalPage", path: "/admin/dashboard/vendorApprovalPage", icon: <ClipboardList size={20} /> },
    { name: "Vendors", path: "/admin/dashboard/vendors", icon: <PenSquare size={20} /> },
    { name: "Category Manager", path: "/admin/dashboard/categoryManager", icon: <PenSquare size={20} /> },
    { name: "All Placed Orders", path: "/admin/dashboard/adminOrderPage", icon: <PenSquare size={20} /> },
   
  ];

const handleLogout = () => {
  SweetAlertService.showConfirm(
    "Are you sure?",
    "You will be logged out from the dashboard",
    "Logout",
    "Cancel"
  ).then((confirmed) => {
    if (confirmed) {
      localStorage.clear();
      window.location.href = "/login";
    }
  });
};


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md h-full flex flex-col transition-all duration-300 
          ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && <h1 className="text-lg font-bold text-gray-700">Admin Panel</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-200"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        {/* Sidebar Menu */}
        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-md mb-1 text-gray-500 transition-colors
                ${location.pathname === item.path
                  ? "bg-[#3e3e63] text-white"
                  : "hover:bg-gray-200"}`}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-md text-red-500 hover:bg-red-100"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
