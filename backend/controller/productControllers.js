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
