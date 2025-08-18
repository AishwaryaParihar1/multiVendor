import { useState } from "react";
import axios from "axios";
import SweetAlertService from "../components/ui/SweetAlertService"; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    businessName: "",
    phone: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
    console.log("Register response:", response.data);  
    await SweetAlertService.showSuccess("Registration successful!", "Please login.");
    window.location.href = "/";
  } catch (err) {
    console.error("Register error:", err); 
    SweetAlertService.showError(
      "Registration Failed",
      err.response?.data?.message || "An error occurred"
    );
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-primary">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
          />
          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
          />
          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
          />
          {/* Role */}
          <select
            name="role"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>

          {/* Vendor fields */}
          {formData.role === "vendor" && (
            <>
              <input
                name="businessName"
                placeholder="Business Name"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent border-gray-300"
              />
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white rounded-lg bg-primary hover:bg-secondary transition-colors duration-300"
          >
            Register
          </button>

          {/* Note */}
          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <a href="/" className="text-accent hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
