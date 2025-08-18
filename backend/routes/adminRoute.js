const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Only admin can access these
router.get(
  "/vendors/pending",
  protect,
  authorizeRoles("admin"),
  adminController.getPendingVendors
);
router.put(
  "/vendors/approve/:id",
  protect,
  authorizeRoles("admin"),
  adminController.approveVendor
);
router.put(
  "/vendors/reject/:id",
  protect,
  authorizeRoles("admin"),
  adminController.rejectVendor
);
router.get(
  "/vendors/approved",
  protect,
  authorizeRoles("admin"),
  adminController.getApprovedVendors
);
router.get(
  "/dashboard/stats",
  protect,
  authorizeRoles("admin"),
  adminController.getDashboardStats
);

module.exports = router;
