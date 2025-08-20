const Product = require("../models/Product");

exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(10);
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getNewArrivalProducts = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).sort({ releaseDate: -1 }).limit(10);
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBestSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(10);
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "name businessName email");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error: failed to fetch products." });
  }
};


// In your productControllers.js
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("vendor", "name businessName email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



