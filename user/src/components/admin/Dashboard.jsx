import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  HighlightOff as HighlightOffIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import SweetAlertService from "../ui/SweetAlertService";

const statCards = [
  {
    title: "Total Vendor Requests",
    icon: <DashboardIcon sx={{ fontSize: 36, color: "#f97316" }} />, // smaller icon
    key: "totalVendorRequests",
  },
  {
    title: "Approved Vendors",
    icon: <CheckCircleIcon sx={{ fontSize: 36, color: "#16a34a" }} />,
    key: "approvedVendorCount",
  },
  {
    title: "Rejected Vendors",
    icon: <HighlightOffIcon sx={{ fontSize: 36, color: "#ef4444" }} />,
    key: "rejectedVendorCount",
  },
  {
    title: "Total Customers",
    icon: <GroupIcon sx={{ fontSize: 36, color: "#2563eb" }} />,
    key: "totalUserCount",
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVendorRequests: "-",
    approvedVendorCount: "-",
    rejectedVendorCount: "-",
    totalUserCount: "-",
  });

  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    <Box sx={{ maxWidth: 1100, mx: "auto", pt: 4, px: 2 }}>
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        color={theme.palette.primary.main}
        gutterBottom
      >
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={6}
              sx={{
                p: 3,               // Slightly less padding
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[6],
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[12],
                },
                height: 180,        // Slightly smaller height
                minHeight: 180,
              }}
            >
              <Box>{card.icon}</Box>
              <Typography
                variant="h6"
                fontWeight="600"
                color={theme.palette.text.primary}
                sx={{ mt: 2 }}
                align="center"
              >
                {card.title}
              </Typography>
              <Typography
                variant="h4"       // Slightly smaller variant for number
                fontWeight="extrabold"
                color={theme.palette.secondary.main}
                sx={{ mt: 2 }}
                align="center"
              >
                {loading ? (
                  <CircularProgress size={28} color="inherit" />
                ) : (
                  stats[card.key]
                )}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
