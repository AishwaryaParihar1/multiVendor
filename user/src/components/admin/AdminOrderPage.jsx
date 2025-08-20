import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Collapse,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { ChevronDown, ChevronUp, Image } from "lucide-react";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10, color: theme.palette.text.secondary }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading all orders…</Typography>
      </Box>
    );
  }

  if (!orders.length) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="text.secondary">
          No orders have been placed yet.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Once customers place orders, they will show here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: theme.palette.primary.main, fontWeight: "bold", textAlign: "center" }}>
        All Orders (Admin)
      </Typography>
      <Stack spacing={4}>
        {orders.map((order, idx) => {
          const isExpanded = expandedIndex === idx;
          const orderDate = order.createdAt || order.placedAt;

          return (
            <Paper key={order._id} sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
              {/* Header */}
              <Box
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight="600" color="primary">
                    Order ID:
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ wordBreak: "break-all" }}>
                    {order._id}
                  </Typography>

                  <Typography variant="subtitle1" fontWeight="600" color="primary" sx={{ ml: 4 }}>
                    Placed At:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(orderDate).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "9999px",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      color:
                        order.orderStatus === "pending" ? "#92400e" :
                        order.orderStatus === "delivered" ? "#166534" :
                        "#1e40af",
                      backgroundColor:
                        // order.orderStatus === "pending" ? "#fef3c7" :
                        // order.orderStatus === "delivered" ? "#bbf7d0" :
                        "#bfdbfe",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.orderStatus.toUpperCase()}
                  </Typography>

                  <Typography
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "9999px",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      color: order.paymentStatus === "paid" ? "#166534" : "#991b1b",
                      backgroundColor: order.paymentStatus === "paid" ? "#bbf7d0" : "#fecaca",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </Typography>

                  <Box>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </Box>
                </Box>
              </Box>

              {/* Details */}
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={4}>
                  {/* Products & Vendors */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Products & Vendors
                    </Typography>
                    <Stack spacing={2}>
                      {order.items.map((item) => (
                        <Box key={item._id} sx={{ display: "flex", gap: 2, bgcolor: "#f9fafb", borderRadius: 2, p: 2 }}>
                          <Avatar
                            src={item.product?.images?.[0] || ""}
                            alt={item.product?.name}
                            variant="rounded"
                            sx={{ width: 64, height: 64 }}
                          >
                            {!item.product?.images?.[0] && <Image size={32} color={theme.palette.grey[400]} />}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" color="primary" fontWeight="bold">
                              {item.product?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              Vendor: {item.vendor?.businessName || "N/A"} ({item.vendor?.name || "N/A"})
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              Email: {item.vendor?.email || "N/A"}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Qty: <strong>{item.quantity}</strong>
                            </Typography>
                          </Box>
                          <Typography variant="h6" color="secondary" sx={{ minWidth: 90, textAlign: "right", fontWeight: "bold" }}>
                            ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Grid>

                  {/* Customer & Shipping Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      Customer & Shipping Info
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="600">{order.user?.name || "-"}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>{order.user?.email || "-"}</Typography>

                    <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 3, mb: 1 }}>
                      Shipping Address
                    </Typography>
                    <Box sx={{ typography: "body2", color: "text.primary", whiteSpace: "pre-line" }}>
                      {order.shippingAddress?.fullName || "-"}{"\n"}
                      {order.shippingAddress?.address || "-"}{"\n"}
                      {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
                      {order.shippingAddress?.country || "-"} - {order.shippingAddress?.postalCode || "-"}{"\n"}
                      Phone: {order.shippingAddress?.phone || "-"}
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, textAlign: "right" }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Order Total: ₹
                    {order.totalAmount ? order.totalAmount.toFixed(2) : order.items.reduce((acc, item) => acc + item.quantity * item.priceAtPurchase, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Payment Method: {order.paymentMethod?.toUpperCase() || "-"}
                  </Typography>
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
