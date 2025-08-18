import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Building2, Mail, Phone, Info, BadgeCheck } from "lucide-react";



export default function VendorProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch {
        setProfile(null);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-6">
      <h1 className="text-3xl font-extrabold text-primary mb-8 text-center">
        Your Vendor Profile
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-6">
          <ProfileItem icon={<User size={24} />} label="Name" value={profile.name} />
          <ProfileItem icon={<Building2 size={24} />} label="Business Name" value={profile.businessName} />
          <ProfileItem icon={<Mail size={24} />} label="Email" value={profile.email} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ProfileItem icon={<Phone size={24} />} label="Phone" value={profile.phone || "-"} />
          <ProfileItem
            icon={<BadgeCheck size={24} />}
            label="Status"
            value={
              <StatusBadge status={profile.vendorStatus} />
            }
          />
          <ProfileItem
            icon={<Info size={24} />}
            label="Member Since"
            value={new Date(profile.createdAt).toLocaleDateString()}
          />
        </div>
      </div>
    </div>
  );
}

// Reusable for profile fields
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm border border-gray-200">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-gray-900 text-lg mt-1">{value}</p>
    </div>
  </div>
);

// Status badge with different colors
const StatusBadge = ({ status }) => {
  let colorClass = "bg-gray-300 text-gray-700";
  if (status === "approved") colorClass = "bg-green-100 text-green-800";
  else if (status === "pending") colorClass = "bg-yellow-100 text-yellow-800";
  else if (status === "rejected") colorClass = "bg-red-100 text-red-800";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${colorClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
