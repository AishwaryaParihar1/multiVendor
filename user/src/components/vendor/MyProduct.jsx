import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { useNavigate } from "react-router-dom";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  CircularProgress,
  useTheme,
} from "@mui/material";

export default function MyProduct({ sidebarCollapsed }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  // Calculate drawer width based on sidebar collapsed state
  const drawerWidth = sidebarCollapsed ? 72 : 240;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else if (res.data && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch {
      SweetAlertService.showError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await SweetAlertService.showConfirm(
      "Delete Product?",
      "Are you sure you want to delete this product? This action cannot be undone.",
      "Yes, Delete",
      "Cancel"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/vendor/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      SweetAlertService.showSuccess("Product deleted.");
      fetchProducts();
    } catch {
      SweetAlertService.showError("Failed to delete product.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/vendor/dashboard/edit-product/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        ml: `${drawerWidth}px`,
        p: { xs: 2, md: 4 },
        transition: "margin 0.3s ease",
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          boxShadow: theme.shadows[4],
          overflowX: "auto",
          bgcolor: theme.palette.background.paper,
          p: { xs: 1, md: 3 },
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
            color: theme.palette.primary.main,
          }}
        >
          My Products
        </Typography>

        {products.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: theme.palette.text.secondary }}>
            No products found.
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650, width: "100%" }} aria-label="products table" size="medium">
              <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>MRP</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Selling Price</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Categories</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p._id} hover>
                    <TableCell>{p.name}</TableCell>
                    <TableCell
                      sx={{ maxWidth: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {p.description}
                    </TableCell>
                    <TableCell>₹{p.mrp}</TableCell>
                    <TableCell>₹{p.sellingPrice}</TableCell>
                    <TableCell>
                      {p.categories && p.categories.length > 0
                        ? p.categories.join(", ")
                        : <Typography color="text.secondary" fontStyle="italic">No categories</Typography>}
                    </TableCell>
                    <TableCell>
                      {p.images && p.images.length > 0 ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {p.images.map((img, idx) => (
                            <Avatar
                              key={idx}
                              src={img}
                              variant="rounded"
                              sx={{ width: 40, height: 40, border: `1px solid ${theme.palette.divider}` }}
                              alt={`${p.name}-${idx}`}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography color="text.secondary" fontStyle="italic">
                          No images
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(p._id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="delete" color="error" onClick={() => handleDelete(p._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
