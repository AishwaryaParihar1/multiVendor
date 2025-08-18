import { useState } from "react";
import axios from "axios";
import SweetAlertService from "../components/ui/SweetAlertService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
    const { token, user } = res.data;

localStorage.setItem("token", token);
localStorage.setItem("role", user.role);
localStorage.setItem("userName", user.name || user.email);


window.dispatchEvent(new Event('storage'));


    // Redirect logic:
    if (user.role === "customer") {
      window.location.href = "/";
    } else if (user.role === "vendor") {
      window.location.href = "/vendor/dashboard";
    } else if (user.role === "admin") {
      window.location.href = "/admin/dashboard";
    }
  } catch (err) {
    // handle error as before
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-primary">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white rounded-lg bg-primary hover:bg-secondary transition-colors duration-300"
          >
            Login
          </button>
          {/* Register Link */}
          <p className="text-sm text-center text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-accent hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
