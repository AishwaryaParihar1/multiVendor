import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { User, Mail, Phone, UserSquare, Edit2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.role !== "customer") {
          SweetAlertService.showError("Access denied", "This profile is only for customers.");
          setCustomer(null);
        } else {
          setCustomer(res.data);
          setForm({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
          });
        }
      } catch (error) {
        SweetAlertService.showError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, []);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      SweetAlertService.showError("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      SweetAlertService.showError("Email is required");
      return false;
    }
    // Simple email regex validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email.trim())) {
      SweetAlertService.showError("Enter a valid email");
      return false;
    }
    if (!form.phone.trim()) {
      SweetAlertService.showError("Phone number is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/profile/update`,
        { name: form.name, email: form.email, phone: form.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomer(res.data);
      SweetAlertService.showSuccess("Profile updated successfully");
      setEditing(false);
    } catch (err) {
      SweetAlertService.showError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh] text-primary text-lg font-semibold">
      Loading profile...
    </div>
  );

  if (!customer) return (
    <div className="text-center mt-24 text-error text-lg font-medium">
      Unable to load customer profile.
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary mb-8">My Profile</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            title="Edit Profile"
            className="text-primary hover:text-accent transition"
          >
            <Edit2 size={28} />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            title="Save Profile"
            className="text-primary hover:text-accent transition"
          >
            {saving ? <span>Saving...</span> : <Save size={28} />}
          </button>
        )}
      </div>

      <div className="space-y-6 text-gray-700">
        {/* Name */}
        <div className="flex items-center gap-4">
          <User className="text-primary" size={28} />
          {!editing ? (
            <div>
              <h2 className="font-semibold text-lg">Full Name</h2>
              <p>{customer.name || "-"}</p>
            </div>
          ) : (
            <input
              name="name"
              value={form.name}
              onChange={e => setField("name", e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Full Name"
            />
          )}
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <Mail className="text-primary" size={28} />
          {!editing ? (
            <div>
              <h2 className="font-semibold text-lg">Email</h2>
              <p>{customer.email || "-"}</p>
            </div>
          ) : (
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={e => setField("email", e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Email"
            />
          )}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-4">
          <Phone className="text-primary" size={28} />
          {!editing ? (
            <div>
              <h2 className="font-semibold text-lg">Phone</h2>
              <p>{customer.phone || "-"}</p>
            </div>
          ) : (
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={e => setField("phone", e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Phone Number"
            />
          )}
        </div>

        {/* Role */}
        <div className="flex items-center gap-4">
          <UserSquare className="text-primary" size={28} />
          <div>
            <h2 className="font-semibold text-lg">User Role</h2>
            <p className="capitalize">{customer.role || "-"}</p>
          </div>
        </div>
      </div>

      {!editing && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
