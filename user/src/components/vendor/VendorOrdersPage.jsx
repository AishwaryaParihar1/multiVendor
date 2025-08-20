import React, { useEffect, useState } from "react";
import axios from "axios";
import SweetAlertService from "../ui/SweetAlertService";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Images, Loader2 } from "lucide-react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Divider ,
  Collapse,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";

export default function VendorOrdersPage() {
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
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      setOrders([]);
      SweetAlertService.showError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10, color: theme.palette.primary.main }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your orders...</Typography>
      </Box>
    );
  }

  if (!orders.length) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="text.secondary">
          No orders for your products yet!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Orders placed for your products by customers will show here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", px: 2, py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}>
        <Images size={28} /> My Product Orders
      </Typography>

      {orders.map((order, idx) => {
        const isExpanded = idx === expandedIndex;
        const orderDate = order.createdAt || order.placedAt;
        return (
          <Paper key={order._id} sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                cursor: "pointer",
                gap: 2,
              }}
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
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
                      order.orderStatus === "pending"
                        ? "#92400e"
                        : order.orderStatus === "delivered"
                        ? "#166534"
                        : "#1e40af",
                    backgroundColor:
                      order.orderStatus === "pending"
                        ? "#fef3c7"
                        : order.orderStatus === "delivered"
                        ? "#bbf7d0"
                        : "#bfdbfe",
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

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Box>
              </Box>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Products Sold
                  </Typography>
                  {order.items.map((item) => (
                    <Box
                      key={item._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#f9fafb",
                        borderRadius: 2,
                        p: 1,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        src={item.product?.images?.[0] || "/placeholder.png"}
                        alt={item.product?.name}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="600">
                          {item.product?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.product?.description || "No description"}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Qty: <strong>{item.quantity}</strong>
                        </Typography>
                      </Box>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 80, textAlign: "right" }}>
                        ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Customer Info & Shipping
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600">
                    {order.user?.name || "Unnamed Customer"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {order.user?.email}
                  </Typography>

                  <Typography variant="subtitle1" fontWeight="600" sx={{ mt: 2 }}>
                    Shipping Address:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress?.fullName}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress?.address}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
                    {order.shippingAddress?.country} - {order.shippingAddress?.postalCode}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Phone: {order.shippingAddress?.phone}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: "right" }}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Total Earned: ₹
                  {order.items.reduce(
                    (acc, item) => acc + item.quantity * item.priceAtPurchase,
                    0
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
}
