const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getVendorOrders, getMyOrders } = require("../controller/orderController");
const auth = require("../middleware/authMiddleware");

// POST /api/order/create
router.post("/create", auth.protect, createOrder);
router.get("/all", auth.protect , getAllOrders); 
router.get("/vendor", auth.protect, getVendorOrders); 
router.get("/my", auth.protect, getMyOrders);

module.exports = router;
