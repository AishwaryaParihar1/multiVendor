import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { ChevronDown, ChevronUp } from "lucide-react";
import avatar from "../../assets/avatar.png";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
  MenuItem,
  Select,
  Card,
  CardContent,
  CardActionArea,
  Divider,
  Collapse,
  Avatar,
  Stack,
  IconButton,
  useTheme,
} from "@mui/material";

const statusMap = {
  pending: { color: "warning", label: "In Progress" },
  delivered: { color: "success", label: "Delivered" },
  cancelled: { color: "error", label: "Cancelled" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "In Progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("");

  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/order/my");
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by status
  const filterByStatus = (orders, status) => {
    if (status === "all") return orders;
    return orders.filter((o) => o.orderStatus === status);
  };

  // Filter orders by date range
  const filterByDateRange = (orders, range) => {
    if (!range) return orders;
    const now = new Date();
    if (range === "last7") {
      const past7 = new Date(now);
      past7.setDate(now.getDate() - 7);
      return orders.filter((order) => {
        const date = new Date(order.createdAt || order.placedAt);
        return date >= past7 && date <= now;
      });
    }
    if (range === "last30") {
      const past30 = new Date(now);
      past30.setDate(now.getDate() - 30);
      return orders.filter((order) => {
        const date = new Date(order.createdAt || order.placedAt);
        return date >= past30 && date <= now;
      });
    }
    if (range.match(/^\d{4}$/)) {
      return orders.filter((order) => {
        const date = new Date(order.createdAt || order.placedAt);
        return date.getFullYear() === Number(range);
      });
    }
    return orders;
  };

  const filteredOrdersByStatus = filterByStatus(orders, statusFilter);
  const filteredOrders = filterByDateRange(filteredOrdersByStatus, dateRange);

  if (loading)
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: "1.25rem",
        }}
      >
        Loading your orders…
      </Box>
    );

  if (!orders.length)
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          color: theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: "1.25rem",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          You haven't placed any orders yet.
        </Typography>
        <Typography>Orders you place will appear here.</Typography>
      </Box>
    );

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 }, maxWidth: 1140, mx: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        color="primary.main"
        textAlign="center"
        mb={{ xs: 3, md: 5 }}
        letterSpacing={1.1}
        sx={{ fontFamily: "'Cinzel', serif" }}
      >
        My Orders
      </Typography>

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          mb: 5,
          justifyContent: { xs: "center", sm: "space-between" },
        }}
      >
        <Tabs
          value={statusFilter}
          onChange={(_, v) => setStatusFilter(v)}
          sx={{
            minHeight: 42,
            ".MuiTab-root": {
              textTransform: "none",
              minHeight: 42,
              fontWeight: 400,
              fontSize: 14,
              px: 2,
              borderRadius: 8,
              transition: "all 0.3s ease",
            },
            ".Mui-selected": {
              color: "white !important",
              bgcolor: theme.palette.primary.main,
              fontWeight: 700,
              boxShadow: theme.shadows[3],
            },
            borderRadius: 10,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {FILTERS.map((f) => (
            <Tab key={f.key} value={f.key} label={f.label} />
          ))}
        </Tabs>

        <Select
          variant="outlined"
          size="small"
          displayEmpty
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          sx={{
            minWidth: 180,
            borderRadius: 3,
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.divider,
            },
            fontSize: 14,
            fontWeight: 400,
          }}
          renderValue={(selected) => (selected ? selected : "Select date range")}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="last7">Last 7 days</MenuItem>
          <MenuItem value="last30">Last 30 days</MenuItem>
          <MenuItem value="2024">2024</MenuItem>
          <MenuItem value="2023">2023</MenuItem>
        </Select>
      </Box>

      <Stack spacing={4}>
        {filteredOrders.length === 0 && (
          <Typography
            variant="body1"
            textAlign="center"
            color={theme.palette.text.secondary}
            mt={4}
          >
            No orders matching current filters.
          </Typography>
        )}

        {filteredOrders.map((order, idx) => {
          const isExpanded = expandedIndex === idx;
          const status = statusMap[order.orderStatus] || {
            color: "primary",
            label: order.orderStatus,
          };

          return (
            <Card
              key={order._id}
              variant="outlined"
              sx={{
                borderRadius: 4,
                bgcolor: "#fff",
                transition: "box-shadow 0.3s",
                ":hover": { boxShadow: 6, cursor: "pointer" },
                overflow: "hidden",
              }}
            >
              <CardActionArea
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                sx={{ display: "block", textAlign: "initial" }}
              >
                <CardContent
                  sx={{
                    pb: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Chip
                    size="small"
                    label={status.label}
                    color={status.color}
                    sx={{ fontWeight: "bold", mr: 0.5, px: 1.5, py: 0.4, fontSize: 12 }}
                  />
                  <Typography
                    sx={{
                      ml: 0.5,
                      color: theme.palette.text.secondary,
                      fontSize: 14,
                      fontWeight: 600,
                      minWidth: 140,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(order.createdAt || order.placedAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 300 }, pl: { xs: 0, sm: 2 } }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="normal"
                      color="primary.main"
                      sx={{ mb: 0.5, fontSize: 16, letterSpacing: 0.3 }}
                    >
                      Order ID: {order._id}
                    </Typography>
                    {order.items && order.items[0] && (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          src={avatar}
                          alt={order.items[0]?.product?.name || "avatar"}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            boxShadow: theme.shadows[2],
                          }}
                          variant="rounded"
                        />

                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 16,
                            color: theme.palette.text.primary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 250,
                          }}
                        >
                          {order.items[0].product?.name}
                          {order.items.length > 1 && (
                            <Box
                              component="span"
                              sx={{
                                color: theme.palette.secondary.main,
                                fontWeight: 600,
                                ml: 0.5,
                              }}
                            >
                              &amp; {order.items.length - 1} more item
                              {order.items.length > 2 ? "s" : ""}
                            </Box>
                          )}
                        </Typography>
                      </Stack>
                    )}
                    {order.items && order.items[0] && (
                      <Typography sx={{ fontSize: 14, mt: 0.5, color: "#666" }} fontWeight={500}>
                        ₹
                        {order.items.reduce(
                          (acc, item) => acc + item.quantity * (item.priceAtPurchase || 0),
                          0
                        )}
                      </Typography>
                    )}
                  </Box>
                  <Box ml="auto" display="flex" alignItems="center">
                    <Chip
                      label={order.paymentStatus.toUpperCase()}
                      size="small"
                      color={
                        order.paymentStatus === "paid"
                          ? "success"
                          : order.paymentStatus === "cancelled"
                          ? "error"
                          : "default"
                      }
                      sx={{
                        fontWeight: "bold",
                        mr: 2,
                        fontSize: 12,
                        px: 1.5,
                        py: 0.3,
                      }}
                    />
                    <IconButton size="small" aria-label="toggle order details">
                      {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                    </IconButton>
                  </Box>
                </CardContent>
              </CardActionArea>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <Divider />
                <Box
                  sx={{
                    px: 4,
                    py: 4,
                    bgcolor: "#f9fbfc",
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold" mb={3}>
                    Products
                  </Typography>
                  <Stack spacing={3}>
                    {order.items.map((item) => (
                      <Box
                        key={item._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          bgcolor: "#fff",
                          borderRadius: 3,
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          boxShadow: theme.shadows[1],
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      >
                        <Avatar
                          src={item.product?.images?.[0] || "/placeholder.png"}
                          alt={item.product?.name}
                          variant="rounded"
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 2,
                            mr: 3,
                            boxShadow: theme.shadows[2],
                          }}
                        />
                        <Box sx={{ flex: 1, minWidth: 150 }}>
                          <Typography fontWeight="bold" color="primary.main" fontSize={16}>
                            {item.product?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Vendor: {item.vendor?.businessName || "N/A"} ({item.vendor?.name || "Vendor"})
                          </Typography>
                          <Typography variant="body2" mt={0.8} fontStyle="italic" color="text.primary">
                            Qty: <b>{item.quantity}</b>
                          </Typography>
                        </Box>
                        <Typography
                          fontWeight="bold"
                          color="secondary.main"
                          sx={{ minWidth: 90, fontSize: 16, textAlign: "right" }}
                        >
                          ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 4 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { sm: "center" },
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography fontWeight="600" color="text.secondary" fontSize={14}>
                      Payment Method: {order.paymentMethod?.toUpperCase()}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      Order Total: ₹{order.totalAmount && order.totalAmount.toFixed(2)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.9, fontSize: 14 }}
                  >
                    <b>Shipping:</b> {order.shippingAddress?.fullName}, {order.shippingAddress?.address},{" "}
                    {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
                    {order.shippingAddress?.country}, {order.shippingAddress?.postalCode}.{" "}
                    <b>Phone:</b> {order.shippingAddress?.phone}
                  </Typography>
                </Box>
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
