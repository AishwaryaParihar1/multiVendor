const User = require("../models/User");

const Product = require("../models/Product");

exports.addProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const {
      name,
      description,
      mrp,
      sellingPrice,
      images,
      categories,
      isTrending,
      isNewArrival,
      isBestSeller,
    } = req.body;
    const newProduct = new Product({
      name,
      description,
      mrp,
      sellingPrice,
      images,
      vendor: vendorId,
      categories,
      isTrending: !!isTrending,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
    });

    await newProduct.save();
    res.json({ message: "Product added!", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVendorProfile = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const vendor = await User.findOne({ _id: vendorId, role: "vendor" }).select(
      "-password"
    );

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(vendor);
  } catch (error) {
    console.error("Vendor profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/vendorController.js
exports.getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const products = await Product.find({ vendor: vendorId }); // vendor ke products
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;
    const product = await Product.findOneAndDelete({
      _id: productId,
      vendor: vendorId,
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or access denied" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;
    const {
      name,
      description,
      mrp,
      sellingPrice,
      images,
      categories,
      isTrending,
      isNewArrival,
      isBestSeller,
    } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: productId, vendor: vendorId },
      {
        name,
        description,
        mrp,
        sellingPrice,
        images,
        categories,
        isTrending: !!isTrending,
        isNewArrival: !!isNewArrival,
        isBestSeller: !!isBestSeller,
      },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or access denied" });
    }

    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;
    const product = await Product.findOne({ _id: productId, vendor: vendorId });
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or access denied", product: null });
    }
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Server error", product: null });
  }
};
