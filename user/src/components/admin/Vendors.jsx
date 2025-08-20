import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  useTheme,
} from "@mui/material";
import SweetAlertService from "../ui/SweetAlertService";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/vendors/approved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch {
      SweetAlertService.showError("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: theme.palette.background.default, width: "100%", maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color={theme.palette.primary.main} align="center">
        Approved Vendors
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="primary" />
          <Typography sx={{ ml: 2 }} variant="body1" color="text.secondary">
            Loading vendors...
          </Typography>
        </Box>
      ) : vendors.length === 0 ? (
        <Typography align="center" variant="body1" color="text.secondary" sx={{ py: 5 }}>
          No approved vendors found.
        </Typography>
      ) : (
        <Paper sx={{ overflowX: "auto" }}>
          <Table stickyHeader aria-label="approved vendors table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Business Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id} hover>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.businessName}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.phone || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
