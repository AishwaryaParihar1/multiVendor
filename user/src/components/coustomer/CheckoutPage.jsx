import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import SweetAlertService from "../ui/SweetAlertService";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const theme = useTheme();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.sellingPrice,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.country.trim() ||
      !form.postalCode.trim() ||
      !form.phone.trim()
    ) {
      SweetAlertService.showError("Please fill all the required fields");
      return false;
    }
    if (cart.items.length === 0) {
      SweetAlertService.showInfo("Your cart is empty");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;
    setPlacingOrder(true);
    try {
      const orderData = {
        cartId: cart._id,
        shippingDetails: { ...form },
        totalAmount,
      };
      await API.post("/order/create", orderData);
      SweetAlertService.showSuccess("Order placed successfully!");
      setCart({ items: [] });
    } catch {
      SweetAlertService.showError("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          color: theme.palette.text.secondary,
        }}
      >
        <CircularProgress />
        <Typography mt={2} variant="h6">
          Loading your cart...
        </Typography>
      </Box>
    );

  if (cart.items.length === 0)
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          color: theme.palette.text.secondary,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography>Add products to cart before checkout.</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "89vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          width: "100%",
          mx: "auto",
          py: { xs: 3, md: 4 },
          px: { xs: 1, sm: 4, md: 6 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          mt: { xs: 4, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="primary.main"
          mb={6}
        >
          Checkout
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 6,
            alignItems: "center",      // Vertically center content
            minHeight: "55vh",         // Makes UI balanced
          }}
        >
          {/* Shipping Details Form */}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              width: "100%",
              maxWidth: 430,
              mx: "auto",
              alignSelf: "center",    // Center this column
              bgcolor: "transparent",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={3}>
              Shipping Details
            </Typography>

            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="State/Province"
              name="state"
              value={form.state}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Postal Code"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              required
            />

            <FormControl component="fieldset" sx={{ mt: 4 }}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: "600" }}>
                Payment Method
              </FormLabel>
              <RadioGroup
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                />
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Credit/Debit Card"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Order Summary */}
          <Box
            sx={{
              alignSelf: "center",         // Center this column
              width: "100%",
              maxWidth: 440,
              mx: "auto",
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={3}>
              Order Summary
            </Typography>

            <Box
              sx={{
                maxHeight: "60vh",
                overflowY: "auto",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                px: 2,
                py: 1,
                mb: 4,
                bgcolor: "background.default",
              }}
            >
              {cart.items.map(({ product, quantity }) => (
                <Box
                  key={product._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    sx={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      fontWeight="600"
                      noWrap
                      title={product.name}
                      sx={{ fontSize: "1rem" }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      title={product.description}
                      sx={{ fontSize: "0.85rem" }}
                    >
                      {product.description}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ mt: 0.5 }}>
                      Qty: {quantity}
                    </Typography>
                  </Box>
                  <Typography
                    fontWeight="bold"
                    sx={{ whiteSpace: "nowrap", minWidth: 75 }}
                  >
                    ₹{(product.sellingPrice * quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                Total:
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                ₹{totalAmount.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={placeOrder}
              disabled={placingOrder}
              sx={{ fontWeight: 600, fontSize: "1.1rem", py: 1.8 }}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
