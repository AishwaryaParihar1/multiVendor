import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Trash2, ShoppingCart } from "lucide-react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import SweetAlertService from "../ui/SweetAlertService";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data);
    } catch {
      setWishlist({ products: [] });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    setUpdating(true);
    try {
      await API.delete(`/wishlist/remove/${productId}`);
      setWishlist((cur) => ({
        ...cur,
        products: cur.products.filter((p) => p._id !== productId),
      }));
      SweetAlertService.showSuccess("Removed from wishlist.");
    } catch {
      SweetAlertService.showError("Failed to remove from wishlist.");
    } finally {
      setUpdating(false);
    }
  };

  const addToCart = async (productId) => {
    setUpdating(true);
    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      SweetAlertService.showSuccess("Added to cart!");
    } catch {
      SweetAlertService.showError("Failed to add product to cart.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ p: 6, textAlign: "center", color: theme.palette.text.secondary }}>
        <CircularProgress />
        <Typography mt={2}>Loading wishlist...</Typography>
      </Box>
    );

  if (wishlist.products.length === 0)
    return (
      <Box sx={{  textAlign: "center", color: theme.palette.text.secondary }}>
        <Typography variant="h4" mb={2}>
          Your wishlist is empty
        </Typography>
        <Typography>Add products to your wishlist to see them here.</Typography>
      </Box>
    );

  return (
  <Box
  sx={{
    width: "100%",    // Changed from 100vw to 100%
    minHeight: "90vh",
    bgcolor: "#fff",
    px: { xs: 1, sm: 4, md: 8 },
    boxSizing: "border-box",
    overflowX: "hidden",   // Extra safety to prevent horizontal scroll
  }}
>
      {/* Header */}
   <Box sx={{ maxWidth: 900, mx: "auto" }}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        mb: 0,
        mt: 3,          // Removed top margin
        textAlign: "left",
      }}
    >
      Product name
    </Typography>
           <Divider sx={{ mb: 1.5, mt: 1 }} />

        {/* Wishlist Items */}
        {wishlist.products.map((prod, idx) => (
          <Box
            key={prod._id}
            sx={{
              display: "flex",
              alignItems: "center",
              py: { xs: 2, sm: 2.5 },
              borderBottom:
                idx === wishlist.products.length - 1
                  ? "none"
                  : "1px solid #e5e5e5",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            {/* Delete Icon */}
            <IconButton
              color="inherit"
              disabled={updating}
              onClick={() => removeFromWishlist(prod._id)}
              sx={{ mr: { xs: 0, sm: 1 } }}
              aria-label={`Remove ${prod.name} from wishlist`}
            >
              <Trash2 size={24} />
            </IconButton>

            {/* Product Image */}
            <Box
              component="img"
              src={prod.images?.[0] || "/placeholder.png"}
              alt={prod.name}
              loading="lazy"
              sx={{
                width: { xs: 56, sm: 80 },
                height: { xs: 56, sm: 80 },
                objectFit: "cover",
                borderRadius: 0.5,
                bgcolor: "#f6f6f6",
                flexShrink: 0,
              }}
            />

            {/* Product Name */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                ml: { xs: 1, sm: 2 },
                flex: 1,
                minWidth: { xs: 120, sm: 200 },
                maxWidth: { xs: "calc(100% - 220px)", sm: "none" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={prod.name}
            >
              {prod.name}
            </Typography>

            {/* Add to Cart Button */}
          <Button
  variant="contained"
  disabled={updating}
  onClick={() => addToCart(prod._id)}
  startIcon={<ShoppingCart size={18} />}
  size={window.innerWidth < 600 ? "small" : "medium"}  // Added size prop dynamic based on screen width
  sx={{
    borderRadius: 50,
    px: 3,
    ml: "auto",
    textTransform: "none",
    fontWeight: "bold",
    bgcolor: "#5ca6a5",
    color: "#fff",
    boxShadow: "none",
    ":hover": {
      bgcolor: "#488c8a",
      boxShadow: "none",
    },
    fontSize: { xs: "0.85rem", sm: "1.05rem" },  // Slightly smaller font on xs screen
  }}
>
  Add to cart
</Button>

          </Box>
        ))}
      </Box>
    </Box>
  );
}
