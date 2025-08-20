import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../utils/api";
import SweetAlertService from "../ui/SweetAlertService";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Stack,
  Button,
  useTheme,
  Tooltip,
} from "@mui/material";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      SweetAlertService.showInfo("Please login to add products to your cart!");
      navigate("/login");
      return;
    }
    try {
      await API.post("/cart/add", { productId: product._id, quantity: 1 });
      SweetAlertService.showSuccess("Added to cart!");
    } catch (err) {
      if (err.response?.data?.message?.includes("already")) {
        SweetAlertService.showInfo("Product is already in your cart.");
      } else {
        SweetAlertService.showError("Failed to add to cart.");
      }
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      SweetAlertService.showInfo("Please login to add products to your wishlist!");
      navigate("/login");
      return;
    }
    try {
      await API.post("/wishlist/add", { productId: product._id });
      SweetAlertService.showSuccess("Added to wishlist!");
    } catch (err) {
      if (err.response?.data?.message?.includes("already")) {
        SweetAlertService.showInfo("Product is already in your wishlist.");
      } else {
        SweetAlertService.showError("Failed to add to wishlist.");
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: theme.shadows[6] }}
      whileTap={{ scale: 0.98 }}
      style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", backgroundColor: "#fff", width: 288 }}
    >
      <Card elevation={0} sx={{ borderRadius: 0 }}>
        <CardActionArea onClick={() => navigate(`/product/${product._id}`)} sx={{ outline: "none" }}>
          <Box sx={{ position: "relative", height: 288 }}>
            <CardMedia
              component="img"
              image={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              sx={{ height: "100%", width: "100%", objectFit: "cover" }}
              loading="lazy"
            />
            {isLoggedIn && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "rgba(255,255,255,0.9)",
                  borderRadius: "9999px",
                  padding: 0.5,
                  boxShadow: theme.shadows[2],
                }}
              >
                <Tooltip title="Add to Wishlist" arrow>
                  <IconButton
                    size="small"
                    onClick={handleAddToWishlist}
                    aria-label="Add to Wishlist"
                    sx={{
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: theme.palette.secondary.main, color: "#fff" },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <Heart size={18} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Add to Cart" arrow>
                  <IconButton
                    size="small"
                    onClick={handleAddToCart}
                    aria-label="Add to Cart"
                    sx={{
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: theme.palette.primary.main, color: "#fff" },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <ShoppingCart size={18} />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Box>

          <CardContent sx={{ backgroundColor: "#E5E2D9", display: "flex", flexDirection: "column" }}>
            <Typography
              variant="subtitle1"
              noWrap
              title={product.name}
              sx={{ fontWeight: 600, color: theme.palette.text.primary }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="body2"
              noWrap
              title={product.mrp}
              sx={{ color: theme.palette.text.secondary, fontSize: "0.875rem" }}
            >
              {product.mrp}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography  sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                ₹{product.sellingPrice}
              </Typography>
              {isLoggedIn && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    bgcolor: theme.palette.secondary.main,
                    "&:hover": { bgcolor: theme.palette.secondary.dark },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(e);
                  }}
                >
                  Add to Cart
                </Button>
              )}
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}
