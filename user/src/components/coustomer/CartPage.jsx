import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Trash2, PlusCircle, MinusCircle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    }
  };

  const removeFromCart = async (productId) => {
    setUpdating(true);
    try {
      await API.delete(`/cart/remove/${productId}`);
      setCart((cur) => ({
        ...cur,
        items: cur.items.filter((i) => i.product._id !== productId),
      }));
      SweetAlertService.showSuccess("Item removed from cart.");
    } catch {
      SweetAlertService.showError("Failed to remove item.");
    } finally {
      setUpdating(false);
    }
  };

  const increaseQty = async (productId) => {
    setUpdating(true);
    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      setCart((cur) => {
        const updatedItems = cur.items.map((i) =>
          i.product._id === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
        return { ...cur, items: updatedItems };
      });
      SweetAlertService.showSuccess("Quantity increased.");
    } catch {
      SweetAlertService.showError("Failed to increase quantity.");
    } finally {
      setUpdating(false);
    }
  };

  const decreaseQty = async (productId) => {
    const item = cart.items.find((i) => i.product._id === productId);
    if (item.quantity <= 1) return;
    setUpdating(true);
    try {
      await API.post("/cart/add", { productId, quantity: -1 });
      setCart((cur) => {
        const updatedItems = cur.items.map((i) =>
          i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
        return { ...cur, items: updatedItems };
      });
      SweetAlertService.showSuccess("Quantity decreased.");
    } catch {
      SweetAlertService.showError("Failed to decrease quantity.");
    } finally {
      setUpdating(false);
    }
  };

  const totalPrice = cart.items.reduce(
    (acc, i) => acc + i.quantity * i.product.sellingPrice,
    0
  );

  if (cart.items.length === 0)
    return (
      <Box sx={{ p: 6, textAlign: "center", color: theme.palette.text.secondary }}>
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography>Add items to your cart to see them here.</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "90vh",
        bgcolor: "#fff",
        px: { xs: 1, sm: 4, md: 8 },
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 0,
            mt: 3,
            textAlign: "left",
          }}
        >
          My Cart
        </Typography>
        <Divider sx={{ mb: 1.5, mt: 1 }} />

        {/* Cart Items */}
        {cart.items.map(({ product, quantity }, idx) => (
          <Box
            key={product._id}
            sx={{
              display: "flex",
              alignItems: "center",
              py: { xs: 2, sm: 2.5 },
              borderBottom:
                idx === cart.items.length - 1 ? "none" : "1px solid #e5e5e5",
              gap: { xs: 1, sm: 2 },
              flexWrap: "wrap",
            }}
          >
            {/* Delete Icon */}
            <IconButton
              color="inherit"
              disabled={updating}
              onClick={() => removeFromCart(product._id)}
              sx={{ mr: { xs: 0, sm: 1 } }}
              aria-label={`Remove ${product.name} from cart`}
            >
              <Trash2 size={24} />
            </IconButton>

            {/* Product Image */}
            <Box
              component="img"
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
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

            {/* Product Info */}
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 140, sm: 250 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                ml: { xs: 1, sm: 2 },
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                color="primary.main"
                noWrap
                title={product.name}
              >
                {product.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ mt: 0.3 }}
                title={product.vendor || ""}
              >
                {product.vendor ? `Vendor: ${product.vendor}` : ""}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ mt: 0.8, fontStyle: "italic" }}
                title={product.description}
              >
                {product.description}
              </Typography>
            </Box>

            {/* Quantity Controls */}
            <Box
              sx={{
                display: "flex",
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: 20,
                overflow: "hidden",
                alignItems: "center",
                ml: "auto",
                mr: 2,
              }}
            >
              <IconButton
                onClick={() => decreaseQty(product._id)}
                disabled={quantity <= 1 || updating}
                sx={{
                  px: 1,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.common.white,
                  },
                }}
                aria-label="Decrease quantity"
                size="small"
              >
                <MinusCircle size={20} />
              </IconButton>
              <Box sx={{ px: 3, fontWeight: "bold", fontSize: 16 }}>{quantity}</Box>
              <IconButton
                onClick={() => increaseQty(product._id)}
                disabled={updating}
                sx={{
                  px: 1,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.common.white,
                  },
                }}
                aria-label="Increase quantity"
                size="small"
              >
                <PlusCircle size={20} />
              </IconButton>
            </Box>

            {/* Price */}
            <Typography
              variant="h6"
              fontWeight="bold"
              color="secondary.main"
              sx={{ minWidth: 80 }}
            >
              ₹{(product.sellingPrice * quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}

        {/* Total & Checkout */}
        <Box
          sx={{
            mt: 8,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            pt: 4,
          }}
        >
          <Typography variant="h6" fontWeight="semibold" color="text.primary">
            Total: ₹{totalPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            size="midaum"
            disabled={updating || cart.items.length === 0}
            onClick={() => navigate("/checkoutPage")}
            sx={{ px: 2, py: 1 }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
