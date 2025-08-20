import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { Save, Loader2, Images } from "lucide-react";
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
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProductPage() {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    mrp: "",
    sellingPrice: "",
    images: [],
    categories: [],
    isTrending: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch categories
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

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.product) {
          const product = res.data.product;
          const trimmedCategories = (product.categories || []).map(c => c.trim());
          setForm({
            name: product.name || "",
            description: product.description || "",
            mrp: product.mrp || "",
            sellingPrice: product.sellingPrice || "",
            images: product.images || [],
            categories: trimmedCategories,
            isTrending: Boolean(product.isTrending),
            isNewArrival: Boolean(product.isNewArrival),
            isBestSeller: Boolean(product.isBestSeller),
          });
        }
      } catch {
        SweetAlertService.showError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle category selection
  const handleCategoryChange = (selectedOptions) => {
    setForm(prev => ({
      ...prev,
      categories: selectedOptions ? selectedOptions.map(o => o.value) : [],
    }));
  };

  // Image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const uploadedUrls = [];

      for (const file of files) {
        const data = new FormData();
        data.append("image", file);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/vendor/upload-image`, data, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        uploadedUrls.push(res.data.imageUrl);
      }

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      SweetAlertService.showSuccess("Images uploaded!");
    } catch {
      SweetAlertService.showError("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = (idx) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // Submit updated product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.sellingPrice) > Number(form.mrp)) {
      SweetAlertService.showError("Selling price cannot be greater than MRP.");
      return;
    }
    if (!form.categories.length) {
      SweetAlertService.showError("Please select at least one category.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/api/vendor/products/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      SweetAlertService.showSuccess("Product updated successfully!");
      navigate("/vendor/dashboard/products");
    } catch {
      SweetAlertService.showError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  // Select styles for react-select to match the theme & styling from AddProductPage
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme.palette.background.default,
      borderColor: state.isFocused ? theme.palette.primary.dark : theme.palette.divider,
      boxShadow: state.isFocused ? `0 0 0 2px ${theme.palette.primary.dark}` : "none",
      borderRadius: "0.5rem",
      minHeight: "44px",
      "&:hover": {
        borderColor: theme.palette.primary.dark,
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      zIndex: 9999,
    }),
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10, color: theme.palette.primary.main }}>
        <Loader2 className="animate-spin" size={24} /> Loading...
      </Box>
    );
  }

  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", mt: 6, p: 4, bgcolor: theme.palette.background.paper, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
        <Images size={28} /> Edit Product
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} required fullWidth />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Maximum Retail Price"
                name="mrp"
                type="number"
                value={form.mrp}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Selling Price"
                name="sellingPrice"
                type="number"
                value={form.sellingPrice}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
          </Grid>
          <Box>
            <Typography variant="subtitle1" gutterBottom>Categories</Typography>
            <Select
              isMulti
              options={allCategories}
              value={allCategories.filter(c => form.categories.includes(c.value))}
              onChange={handleCategoryChange}
              styles={customSelectStyles}
              placeholder="Select categories..."
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControlLabel
                control={<Checkbox checked={form.isTrending} onChange={handleChange} name="isTrending" color="primary" />}
                label="Trending"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={<Checkbox checked={form.isNewArrival} onChange={handleChange} name="isNewArrival" color="primary" />}
                label="New Arrival"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={<Checkbox checked={form.isBestSeller} onChange={handleChange} name="isBestSeller" color="primary" />}
                label="Best Seller"
              />
            </Grid>
          </Grid>
          <Box>
            <Button variant="contained" component="label" disabled={saving} startIcon={saving ? <Loader2 className="animate-spin" /> : null}>
              Upload Images
              <input hidden multiple accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
            {form.images.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
                {form.images.map((img, idx) => (
                  <Grid item xs={3} sm={2} key={idx} sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                    <img src={img} alt={`img-${idx}`} style={{ width: "100%", maxHeight: 120, borderRadius: 12, objectFit: "cover" }} />
                    <IconButton size="small" onClick={() => handleRemoveImage(idx)} sx={{ position: "absolute", top: 8, right: 8, bgcolor: "error.main", color: "common.white", "&:hover": { bgcolor: "error.dark" } }}>
                      ✕
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          <Button type="submit" variant="contained" color="primary" disabled={saving} fullWidth sx={{ mt: 3, py: 1.8, fontWeight: "bold" }}>
            {saving ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <Loader2 className="animate-spin" size={24} /> Saving...
              </Box>
            ) : (
              <>
                <Save size={20} style={{ marginRight: 8 }} /> Update Product
              </>
            )}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
