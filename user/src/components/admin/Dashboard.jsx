import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  HighlightOff as HighlightOffIcon,
  Group as GroupIcon,
} from "@mui/icons-material";

const statCards = [
  {
    title: "Total Vendor Requests",
    icon: <DashboardIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#f97316" }} />,
    key: "totalVendorRequests",
  },
  {
    title: "Approved Vendors",
    icon: <CheckCircleIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#16a34a" }} />,
    key: "approvedVendorCount",
  },
  {
    title: "Rejected Vendors",
    icon: <HighlightOffIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#ef4444" }} />,
    key: "rejectedVendorCount",
  },
  {
    title: "Total Customers",
    icon: <GroupIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, color: "#2563eb" }} />,
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
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.3rem", md: "3rem" }
        }}
      >
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[6],
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows,
                },
                height: { xs: 140, sm: 160, md: 180 },
                minHeight: { xs: 140, sm: 160, md: 180 },
              }}
            >
              <Box>{card.icon}</Box>
              <Typography
                variant="h6"
                fontWeight="600"
                color={theme.palette.text.primary}
                sx={{ mt: 2, fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } }}
                align="center"
              >
                {card.title}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="extrabold"
                color={theme.palette.secondary.main}
                sx={{ mt: 2, fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" } }}
                align="center"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
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
