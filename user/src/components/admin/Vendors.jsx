import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService"; // Adjust import path

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/vendors/approved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch (error) {
      SweetAlertService.showError("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6 bg-gray-100 overflow-x-auto w-full">
      <h2 className="text-xl font-bold text-primary mb-4">Approved Vendors</h2>

      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length === 0 ? (
        <p className="text-secondary">No approved vendors found.</p>
      ) : (
        <table className="w-full bg-white rounded-md shadow overflow-hidden">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 border-b border-gray-300">Name</th>
              <th className="text-left px-4 py-2 border-b border-gray-300">Business Name</th>
              <th className="text-left px-4 py-2 border-b border-gray-300">Email</th>
              <th className="text-left px-4 py-2 border-b border-gray-300">Phone</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-b hover:bg-background cursor-default">
                <td className="px-4 py-2">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.businessName}</td>
                <td className="px-4 py-2">{vendor.email}</td>
                <td className="px-4 py-2">{vendor.phone || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
