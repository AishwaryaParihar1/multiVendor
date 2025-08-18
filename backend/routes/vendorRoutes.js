const express = require("express");
const router = express.Router();
const parser = require("../config/multer");
const vendorController = require("../controller/vendorController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get(
  "/profile",
  protect,
  authorizeRoles("vendor"),
  vendorController.getVendorProfile
);

router.post(
  "/products",
  protect,
  authorizeRoles("vendor"),
  vendorController.addProduct
);

router.post(
  "/upload-image",
  protect,
  authorizeRoles("vendor"),
  parser.single("image"),
  async (req, res) => {
    try {
      // Cloudinary uploads image and multer puts its URL in req.file.path
      // `req.file.path` is the uploaded image's Cloudinary url
      res.json({ imageUrl: req.file.path });
    } catch (error) {
      res.status(500).json({ message: "Cloudinary upload failed" });
    }
  }
);

router.get(
  "/products",
  protect,
  authorizeRoles("vendor"),
  vendorController.getVendorProducts
);

router.delete(
  "/products/:id",
  protect,
  authorizeRoles("vendor"),
  vendorController.deleteProduct
);
router.put(
  "/products/:id",
  protect,
  authorizeRoles("vendor"),
  vendorController.updateProduct
);

router.get(
  "/products/:id",
  protect,
  authorizeRoles("vendor"),
  vendorController.getSingleProduct
);

module.exports = router;
