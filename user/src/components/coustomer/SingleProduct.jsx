import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SweetAlertService from "../ui/SweetAlertService";
import ShopHero from "./ShopHero";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      );
      setProduct(res.data);
    } catch (error) {
      SweetAlertService.showError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      SweetAlertService.showInfo("Please login to add products to your cart!");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      SweetAlertService.showSuccess("Added to cart!");
    } catch (err) {
      if (err.response?.data?.message?.includes("already")) {
        SweetAlertService.showInfo("Product is already in your cart.");
      } else {
        SweetAlertService.showError("Failed to add to cart.");
      }
    }
  };

  if (loading) {
    return (
      <Box
        minHeight="70vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  const mockStars = 4;
  const mockReviewCount = 8;

  return (
    <>
    <ShopHero/>
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        py: 6,
        px: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 6,
        bgcolor: "white", // ✅ Pure white
      }}
    >
      {/* Left - Image Slider */}
      <Box flex={1} display="flex" flexDirection="column" alignItems="center">
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 480,
            aspectRatio: "4/3",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f9f9f9",
          }}
        >
          <img
            src={product.images?.[imgIdx] || "/placeholder.png"}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />

          {/* Wishlist */}
          <IconButton
            size="large"
            sx={{
              position: "absolute",
              top: 14,
              right: 16,
              bgcolor: "white",
              ":hover": { bgcolor: theme.palette.secondary.light },
            }}
          >
            <Heart color={theme.palette.secondary.main} />
          </IconButton>

          {/* Left Arrow */}
          {product.images?.length > 1 && (
            <IconButton
              size="large"
              onClick={() =>
                setImgIdx((prev) =>
                  prev === 0 ? product.images.length - 1 : prev - 1
                )
              }
              sx={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                bgcolor: "white",
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}

          {/* Right Arrow */}
          {product.images?.length > 1 && (
            <IconButton
              size="large"
              onClick={() =>
                setImgIdx((prev) =>
                  prev === product.images.length - 1 ? 0 : prev + 1
                )
              }
              sx={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                bgcolor: "white",
              }}
            >
              <ChevronRight />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Right - Product Info */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography
          color="secondary"
          fontSize="0.9rem"
          sx={{ mb: 1, letterSpacing: 1 }}
        >
          NEW COLLECTION
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {product.color || product.categories?.[0] || ""}
        </Typography>

        {/* Ratings */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          {[...Array(5)].map((_, idx) => (
            <Star
              key={idx}
              fill={idx < mockStars ? theme.palette.secondary.main : "none"}
              stroke={theme.palette.secondary.main}
              size={22}
            />
          ))}
          <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
            {mockReviewCount} Reviews
          </Typography>
        </Stack>

        {/* Price + Qty */}
        <Stack direction="row" alignItems="center" spacing={6} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              PRICE
            </Typography>
            <Typography variant="h5" fontWeight={700} color="primary">
              ₹{product.sellingPrice}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              QUANTITY
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Button
                variant="outlined"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                sx={{ minWidth: 36, height: 36 }}
              >
                -
              </Button>
              <Typography variant="h6">{quantity}</Typography>
              <Button
                variant="outlined"
                onClick={() => setQuantity((q) => q + 1)}
                sx={{ minWidth: 36, height: 36 }}
              >
                +
              </Button>
            </Stack>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Description + Details */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={5} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              DESCRIPTION
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {product.description || "No description available."}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              DETAILS
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {product.size && <>Size: {product.size}<br /></>}
              {product.materials && <>Materials: {product.materials}<br /></>}
              {product.weight && <>Weight: {product.weight}<br /></>}
            </Typography>
          </Box>
        </Stack>

        {/* Total + Add to Cart */}
        <Stack direction="row" alignItems="center" spacing={4}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              TOTAL
            </Typography>
            <Typography variant="h5" fontWeight={800} color="secondary">
              ₹{product.sellingPrice * quantity}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{
              fontWeight: 700,
              borderRadius: 1,
              bgcolor: theme.palette.primary.main,
              px: 5,
              py: 1.4,
              fontSize: "1rem",
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
            onClick={handleAddToCart}
          >
            ADD TO CART
          </Button>
        </Stack>
      </Box>
    </Box>
    </>
  );
}
