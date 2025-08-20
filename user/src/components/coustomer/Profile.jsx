import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { User, Mail, Phone, UserSquare, Edit2, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/profile.gif";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";

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
  const theme = useTheme();

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
    setForm((prev) => ({ ...prev, [field]: value }));
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

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.palette.primary.main,
          fontSize: "1.25rem",
          fontWeight: 600,
        }}
      >
        Loading profile...
      </Box>
    );

  if (!customer)
    return (
      <Box
        sx={{
          mt: 12,
          textAlign: "center",
          color: theme.palette.error.main,
          fontSize: "1.25rem",
          fontWeight: 500,
        }}
      >
        Unable to load customer profile.
      </Box>
    );

  return (
    <Box
      maxWidth={600}
      mx="auto"
      bgcolor="background.paper"
      boxShadow={3}
      borderRadius={3}
      p={5}
      mt={5}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4" fontWeight="bold" color="primary.main">
          My Profile
        </Typography>
        {!editing ? (
          <IconButton
            onClick={() => setEditing(true)}
            color="primary"
            title="Edit Profile"
            size="large"
          >
            <Edit2 size={28} />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleSave}
            disabled={saving}
            color="primary"
            title="Save Profile"
            size="large"
          >
            {saving ? (
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.palette.primary.main }}>
                Saving...
              </Typography>
            ) : (
              <Save size={28} />
            )}
          </IconButton>
        )}
      </Stack>

      <Stack spacing={5}>
        {/* Profile Picture */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Avatar
            src={customer.profileImage || profile}
            alt="Profile Picture"
            sx={{ width: 120, height: 120, borderRadius: "50%", boxShadow: theme.shadows[4] }}
          />
        </Box>

        {/* Name Field */}
        <Stack direction="row" alignItems="center" spacing={3}>
          <User size={28} color={theme.palette.primary.main} />
          {!editing ? (
            <Box>
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Full Name
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {customer.name || "-"}
              </Typography>
            </Box>
          ) : (
            <TextField
              fullWidth
              name="name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Full Name"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Email Field */}
        <Stack direction="row" alignItems="center" spacing={3}>
          <Mail size={28} color={theme.palette.primary.main} />
          {!editing ? (
            <Box>
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {customer.email || "-"}
              </Typography>
            </Box>
          ) : (
            <TextField
              fullWidth
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="Email"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Phone Field */}
        <Stack direction="row" alignItems="center" spacing={3}>
          <Phone size={28} color={theme.palette.primary.main} />
          {!editing ? (
            <Box>
              <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                Phone
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {customer.phone || "-"}
              </Typography>
            </Box>
          ) : (
            <TextField
              fullWidth
              type="tel"
              name="phone"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="Phone Number"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Role (non-editable) */}
        <Stack direction="row" alignItems="center" spacing={3}>
          <UserSquare size={28} color={theme.palette.primary.main} />
          <Box>
            <Typography variant="subtitle1" fontWeight="600" color="text.primary">
              User Role
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textTransform: "capitalize" }}>
              {customer.role || "-"}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {!editing && (
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            size="large"
            sx={{ px: 5 }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
