import React, { useState, useEffect } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { PlusCircle, Loader2 } from "lucide-react";
import Select from "react-select";
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Grid,
  IconButton,
  Paper,
  MenuItem,
  useTheme,
} from "@mui/material";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "out-of-stock", label: "Out of Stock" },
];

export default function AddProductPage() {
  const theme = useTheme();
  const [form, setForm] = useState({
    name: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    images: [],
    categories: [],
    subCategory: "",
    stock: "",
    status: "active",
    discount: "",
    isDeleted: false,
    isTrending: false,
    isNewArrival: false,
    isBestSeller: false,
  });
  const [uploading, setUploading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
        const options = res.data.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));
        setAllCategories(options);
      } catch {
        SweetAlertService.showError("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCategoryChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      categories: selectedOptions ? selectedOptions.map((o) => o.value) : [],
    }));
  };

  const handleStatusChange = (e) => {
    setForm((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const uploadedImages = [];
      for (const file of files) {
        const data = new FormData();
        data.append("image", file);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/vendor/upload-image`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        uploadedImages.push(res.data.imageUrl);
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
      SweetAlertService.showSuccess("Images uploaded!");
    } catch {
      SweetAlertService.showError("Image upload failed!");
    }
    setUploading(false);
  };

  const handleRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.sellingPrice) > Number(form.mrp)) {
      SweetAlertService.showError("Selling Price cannot be greater than MRP.");
      return;
    }
    if (form.categories.length === 0) {
      SweetAlertService.showError("Please select at least one category.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      // convert stock and discount to number types or zero
      const productData = {
        ...form,
        stock: form.stock ? Number(form.stock) : 0,
        discount: form.discount ? Number(form.discount) : 0,
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/vendor/products`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      SweetAlertService.showSuccess("Product added successfully!");
      setForm({
        name: "",
        description: "",
        mrp: "",
        sellingPrice: "",
        images: [],
        categories: [],
        subCategory: "",
        stock: "",
        status: "active",
        discount: "",
        isDeleted: false,
        isTrending: false,
        isNewArrival: false,
        isBestSeller: false,
      });
    } catch {
      SweetAlertService.showError("Failed to add product.");
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: theme.palette.background.default,
      borderColor: state.isFocused ? theme.palette.primary.dark : theme.palette.divider,
      boxShadow: state.isFocused ? `0 0 0 2px ${theme.palette.primary.dark}` : null,
      borderRadius: "8px",
      minHeight: "44px",
      "&:hover": { borderColor: theme.palette.primary.dark },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#fff",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      zIndex: 9999,
    }),
  };

  return (
    <Paper
      sx={{
        maxWidth: 720,
        mx: "auto",
        p: 4,
        mt: 6,
        bgcolor: theme.palette.background.paper,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}
      >
        <PlusCircle size={28} /> Add New Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Maximum Retail Price (MRP)"
            name="mrp"
            type="number"
            value={form.mrp}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, step: "0.01" }}
          />
          <TextField
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={form.sellingPrice}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, step: "0.01" }}
          />


          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={form.discount}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: 100 }}
          />

          <TextField
            select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleStatusChange}
            fullWidth
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.isDeleted}
                onChange={handleCheckboxChange}
                name="isDeleted"
                color="primary"
              />
            }
            label="Mark as Deleted"
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Categories
            </Typography>
            <Select
              isMulti
              options={allCategories}
              value={allCategories.filter((c) => form.categories.includes(c.value))}
              onChange={handleCategoryChange}
              styles={customSelectStyles}
              placeholder="Select categories..."
            />
          </Box>

          
          <TextField
            label="Sub Category"
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            fullWidth
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isTrending}
                    onChange={(e) => setForm({ ...form, isTrending: e.target.checked })}
                    color="primary"
                  />
                }
                label="Trending"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isNewArrival}
                    onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })}
                    color="primary"
                  />
                }
                label="New Arrival"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isBestSeller}
                    onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })}
                    color="primary"
                  />
                }
                label="Best Seller"
              />
            </Grid>
          </Grid>

          <Box>
            <Button
              variant="contained"
              component="label"
              disabled={uploading}
              startIcon={uploading ? <Loader2 className="animate-spin" /> : null}
            >
              Upload Images
              <input hidden multiple accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>

            {form.images.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
                {form.images.map((img, idx) => (
                  <Grid
                    item
                    xs={3}
                    sm={2}
                    key={idx}
                    sx={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={img}
                      alt={`img-${idx}`}
                      style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemove(idx)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "error.main",
                        color: "common.white",
                        "&:hover": { bgcolor: "error.dark" },
                      }}
                    >
                      ✕
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uploading}
            fullWidth
            sx={{ mt: 3, py: 1.8, fontWeight: "bold" }}
          >
            {uploading ? "Uploading..." : "Add Product"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
