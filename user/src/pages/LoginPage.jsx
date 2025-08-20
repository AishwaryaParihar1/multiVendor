import React, { useState } from "react";
import axios from "axios";
import SweetAlertService from "../components/ui/SweetAlertService";
import profile from "../assets/profilelogin.svg";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name || user.email);
      window.dispatchEvent(new Event("storage"));

      // Redirect logic:
      if (user.role === "customer") {
        window.location.href = "/";
      } else if (user.role === "vendor") {
        window.location.href = "/vendor/dashboard";
      } else if (user.role === "admin") {
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      SweetAlertService.showError("Login Failed", err.response?.data?.message || "Invalid credentials");
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
          Welcome Back
        </Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              type="email"
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          </Stack>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3, fontWeight: "bold" }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" color="textSecondary" mt={3}>
          Don’t have an account?{" "}
          <a
            href="/register"
            style={{ color: theme.palette.primary.main, textDecoration: "underline" }}
          >
            Register
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
