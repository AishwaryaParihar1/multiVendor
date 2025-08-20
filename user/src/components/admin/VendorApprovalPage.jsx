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
  Button,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";
import SweetAlertService from "../ui/SweetAlertService";

export default function VendorApprovalPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/vendors/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(res.data);
    } catch {
      SweetAlertService.showError("Error!", "Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Approve/Reject handler
  const handleAction = async (id, action) => {
    const confirm = await SweetAlertService.showConfirm(
      `Are you sure you want to ${action} this vendor?`,
      "You won't be able to revert this!"
    );
    if (!confirm) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${action}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      SweetAlertService.showSuccess(`Vendor ${action}d successfully!`);
      fetchVendors();
    } catch {
      SweetAlertService.showError("Error!", `Vendor ${action} failed.`);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: "100%", maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color={theme.palette.primary.main} align="center">
        Vendor Approvals
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Paper sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Business Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ fontStyle: "italic", color: theme.palette.text.secondary, py: 6 }}>
                    No pending vendors
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((vendor) => (
                  <TableRow key={vendor._id} hover>
                    <TableCell>{vendor.name}</TableCell>
                    <TableCell>{vendor.businessName}</TableCell>
                    <TableCell>{vendor.email}</TableCell>
                    <TableCell>{vendor.phone || "-"}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleAction(vendor._id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleAction(vendor._id, "reject")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
