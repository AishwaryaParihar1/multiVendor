const express = require("express");
const router = express.Router();
const productController = require("../controller/productControllers");

// Route to get all products
router.get("/products", productController.getAllProducts);

module.exports = router;
