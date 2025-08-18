import React, { useEffect, useState } from "react";
import SweetAlertService from "../ui/SweetAlertService"; // Adjust path as per your project structure
import axios from "axios";

const VendorApprovalPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/pending`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setVendors(res.data);
      setLoading(false);
    } catch (err) {
      SweetAlertService.showError("Error!", "Failed to fetch vendors.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Approve/Reject handler
  const handleAction = async (id, action) => {
    const confirm = await SweetAlertService.showConfirm(
      `Are you sure you want to ${action} this vendor?`,
      "You won't be able to revert this!"
    );
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${action}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      SweetAlertService.showSuccess(`Vendor ${action}d successfully!`);
      fetchVendors();
    } catch (err) {
      SweetAlertService.showError("Error!", `Vendor ${action} failed.`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 overflow-x-auto w-full">
      <h2 className="text-xl font-bold text-primary mb-4">Vendor Approvals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded-md shadow overflow-hidden">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Business Name</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-left px-4 py-2">Phone</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-secondary">
                  No pending vendors
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor._id} className="border-b hover:bg-background">
                  <td className="px-4 py-2">{vendor.name}</td>
                  <td className="px-4 py-2">{vendor.businessName}</td>
                  <td className="px-4 py-2">{vendor.email}</td>
                  <td className="px-4 py-2">{vendor.phone || "-"}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      className="bg-primary text-white py-1 px-3 rounded hover:bg-secondary transition"
                      onClick={() => handleAction(vendor._id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-error text-white py-1 px-3 rounded hover:bg-secondary transition"
                      onClick={() => handleAction(vendor._id, "reject")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorApprovalPage;
