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
  MenuItem,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "out-of-stock", label: "Out of Stock" },
];

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
    subCategory: "",
    stock: "",
    status: "active",
    discount: "",
    isDeleted: false,
    isTrending: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
          const trimmedCategories = (product.categories || []).map((c) => c.trim());
          setForm({
            name: product.name || "",
            description: product.description || "",
            mrp: product.mrp ?? "",
            sellingPrice: product.sellingPrice ?? "",
            images: product.images || [],
            categories: trimmedCategories,
            subCategory: product.subCategory || "",
            stock: product.stock != null ? product.stock.toString() : "",
            status: product.status || "active",
            discount: product.discount != null ? product.discount.toString() : "",
            isDeleted: product.isDeleted || false,
            isTrending: !!product.isTrending,
            isNewArrival: !!product.isNewArrival,
            isBestSeller: !!product.isBestSeller,
          });
        }
      } catch {
        SweetAlertService.showError("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      categories: selectedOptions ? selectedOptions.map((o) => o.value) : [],
    }));
  };

  const handleStatusChange = (e) => {
    setForm((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

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
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedUrls.push(res.data.imageUrl);
      }
      setForm((prev) => ({
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

  const handleRemove = (idx) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

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
      const productData = {
        ...form,
        stock: form.stock ? Number(form.stock) : 0,
        discount: form.discount ? Number(form.discount) : 0,
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/vendor/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      SweetAlertService.showSuccess("Product updated successfully!");
      navigate("/vendor/dashboard/products");
    } catch {
      SweetAlertService.showError("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme.palette.background.default,
      borderColor: state.isFocused ? theme.palette.primary.dark : theme.palette.divider,
      boxShadow: state.isFocused ? `0 0 0 2px ${theme.palette.primary.dark}` : "none",
      borderRadius: "0.5rem",
      minHeight: 44,
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
      <Box
        sx={{ display: "flex", justifyContent: "center", py: 10, color: theme.palette.primary.main }}
      >
        <Loader2 className="animate-spin" size={24} /> Loading...
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        maxWidth: 700,
        mx: "auto",
        mt: 6,
        p: 4,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}
      >
        <Images size={28} /> Edit Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField label="Product Name" name="name" value={form.name} onChange={handleChange} required fullWidth />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} fullWidth />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Maximum Retail Price" name="mrp" type="number" value={form.mrp} onChange={handleChange} fullWidth inputProps={{ min: 0, step: 0.01 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Selling Price" name="sellingPrice" type="number" value={form.sellingPrice} onChange={handleChange} fullWidth inputProps={{ min: 0, step: 0.01 }} />
            </Grid>
          </Grid>
          <TextField label="Sub Category" name="subCategory" value={form.subCategory} onChange={handleChange} fullWidth />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} fullWidth inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Status" name="status" value={form.status} onChange={handleStatusChange} fullWidth>
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <TextField label="Discount (%)" name="discount" type="number" value={form.discount} onChange={handleChange} fullWidth inputProps={{ min: 0, max: 100 }} />
          <FormControlLabel
            control={<Checkbox checked={form.isDeleted} onChange={handleChange} name="isDeleted" color="primary" />}
            label="Mark as Deleted"
          />
          <Box>
            <Typography variant="subtitle1">Categories</Typography>
            <Select isMulti options={allCategories} value={allCategories.filter(c=>form.categories.includes(c.value))} onChange={handleCategoryChange} styles={customSelectStyles} placeholder="Select categories..." />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControlLabel control={<Checkbox checked={form.isTrending} onChange={handleChange} name="isTrending" color="primary" />} label="Trending" />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel control={<Checkbox checked={form.isNewArrival} onChange={handleChange} name="isNewArrival" color="primary" />} label="New Arrival" />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel control={<Checkbox checked={form.isBestSeller} onChange={handleChange} name="isBestSeller" color="primary" />} label="Best Seller" />
            </Grid>
          </Grid>
          <Box>
            <Button variant="contained" component="label" disabled={uploading} startIcon={uploading ? <Loader2 className="animate-spin" /> : null}>
              Upload Images
              <input hidden multiple accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
            {form.images.length > 0 && (
              <Grid container spacing={2} sx={{ mt: 2, justifyContent: "center" }}>
                {form.images.map((img, idx) => (
                  <Grid key={idx} item xs={3} sm={2} sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                    <img src={img} alt={`img-${idx}`} style={{ width:"100%",maxHeight:120, borderRadius: 12, objectFit:"cover" }} />
                    <IconButton size="small" onClick={() => handleRemove(idx)} sx={{ position:"absolute", top:8, right:8, bgcolor:"error.main", color:"common.white", "&:hover":{ bgcolor:"error.dark" } }}>
                      ✕
                    </IconButton>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          <Button type="submit" variant="contained" disabled={saving} fullWidth sx={{ mt: 3, py: 1.8 }}>
            {saving ? (<>
              <Loader2 className="animate-spin" size={24} /> Saving...
            </>) : (<>
              <Save size={20} style={{ marginRight: 8 }} /> Update Product
            </>)}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
