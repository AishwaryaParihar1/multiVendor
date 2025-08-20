import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import ProductCard from "./ProductCard";
import ShopHero from "./ShopHero";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      SweetAlertService.showError("Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!products.length) {
    return (
      <Typography align="center" variant="h6" color="text.secondary" sx={{ mt: 8 }}>
        No products available.
      </Typography>
    );
  }

  return (
    <>
      <ShopHero/>
    <Box sx={{ maxWidth: 1400, mx: "auto", px: 2, py: 4 }}>
      <Grid
        container
        spacing={3}
        justifyContent="center"   // ⭐ cards ko center align karega
      >
        {products.map((product) => (
          <Grid
            item
            key={product._id}
            xs={12}
            sm={6}
            md={3}   // ⭐ md se upar ek row me 4 cards
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
}
