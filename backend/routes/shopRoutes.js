const express = require("express");
const router = express.Router();

const productController = require("../controller/productControllers");
const cartController = require("../controller/cartControllers");
const wishlistController = require("../controller/wishlistControllers");
const authMiddleware = require("../middleware/authMiddleware");

// Product routes
router.get("/products/trending", productController.getTrendingProducts);
router.get("/products/new-arrival", productController.getNewArrivalProducts);
router.get("/products/best-seller", productController.getBestSellerProducts);

// Cart routes (authenticated)
router.get("/cart", authMiddleware.protect, cartController.getCart);
router.post("/cart/add", authMiddleware.protect, cartController.addToCart);
router.delete("/cart/remove/:productId", authMiddleware.protect, cartController.removeFromCart);

// // Wishlist routes (authenticated)
 router.get("/wishlist", authMiddleware.protect, wishlistController.getWishlist);
router.post("/wishlist/add", authMiddleware.protect, wishlistController.addToWishlist);
router.delete("/wishlist/remove/:productId", authMiddleware.protect, wishlistController.removeFromWishlist);

module.exports = router;
