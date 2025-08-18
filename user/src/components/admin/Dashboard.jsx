import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipboardList, CheckCircle2, XCircle, Users } from "lucide-react";
import SweetAlertService from "../ui/SweetAlertService";

const statCards = [
  {
    title: "Total Vendor Requests",
    icon: <ClipboardList size={30} className="text-orange-500" />,
    bg: "bg-orange-50",
    key: "totalVendorRequests",
  },
  {
    title: "Approved Vendors",
    icon: <CheckCircle2 size={30} className="text-green-600" />,
    bg: "bg-green-50",
    key: "approvedVendorCount",
  },
  {
    title: "Rejected Vendors",
    icon: <XCircle size={30} className="text-red-500" />,
    bg: "bg-red-50",
    key: "rejectedVendorCount",
  },
  {
    title: "Total customer",
    icon: <Users size={30} className="text-blue-600" />,
    bg: "bg-blue-50",
    key: "totalUserCount",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVendorRequests: "-",
    approvedVendorCount: "-",
    rejectedVendorCount: "-",
    totalUserCount: "-",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/dashboard/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch {
        SweetAlertService.showError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pt-4">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center ${card.bg}`}
          >
            <div>{card.icon}</div>
            <div className="text-xl mt-2 font-semibold text-gray-800">
              {card.title}
            </div>
            <div className="mt-4 text-4xl font-extrabold text-accent">
              {loading ? <span className="animate-pulse text-gray-400">...</span> : stats[card.key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
