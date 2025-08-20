import React, { useState } from "react";
import axios from "axios";
import SweetAlertService from "../components/ui/SweetAlertService";
import profile from "../assets/profilelogin.svg";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    businessName: "",
    phone: "",
  });
  const theme = useTheme();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData);
      await SweetAlertService.showSuccess("Registration successful!", "Please login.");
      window.location.href = "/";
    } catch (err) {
      SweetAlertService.showError("Registration Failed", err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 5,
          borderRadius: 3,
          boxShadow: 3,
          textAlign: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Avatar
          src={profile}
          alt="Profile"
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 3,
          }}
        />
        <Typography variant="h5" mb={3} fontWeight="bold" color="primary">
          Create Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Full Name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            />
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            />
            <TextField
              name="password"
              label="Password"
              variant="outlined"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "&.Mui-focused": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            />
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              sx={{
                backgroundColor: "transparent",
                color: theme.palette.text.primary,
                "&:focus": {
                  backgroundColor: "transparent",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.divider,
                },
                "& .MuiSelect-icon": {
                  color: theme.palette.text.primary,
                },
              }}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </Select>

            {formData.role === "vendor" && (
              <>
                <TextField
                  name="businessName"
                  label="Business Name"
                  variant="outlined"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      "&.Mui-focused": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                />
                <TextField
                  name="phone"
                  label="Phone"
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      "&.Mui-focused": {
                        backgroundColor: "transparent",
                      },
                    },
                  }}
                />
              </>
            )}
          </Stack>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3, fontWeight: "bold" }}
          >
            REGISTER
          </Button>
        </form>
        <Typography variant="body2" color="textSecondary" mt={3}>
          Already have an account?{" "}
          <a href="/login" style={{ color: theme.palette.primary.main, textDecoration: "underline" }}>
            Log In
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
