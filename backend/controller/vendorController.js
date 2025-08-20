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
      subCategory,
      stock,
      status,
      discount,
      isDeleted,
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
      subCategory: subCategory || null,
      stock: stock || 0,
      status: status || "active",
      discount: discount || 0,
      isDeleted: !!isDeleted,
      isTrending: !!isTrending,
      isNewArrival: !!isNewArrival,
      isBestSeller: !!isBestSeller,
    });

    await newProduct.save();
    res.json({ message: "Product added!", product: newProduct });
  } catch (err) {
    console.error("Add product error:", err);
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

exports.getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user._id;
    // Exclude soft deleted products
    const products = await Product.find({ vendor: vendorId, isDeleted: false })
      .populate("vendor", "name businessName email")
      .sort({ createdAt: -1 }); // Optional: latest first

    res.json(products);
  } catch (err) {
    console.error("Get vendor products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;

    // Soft delete instead of hard delete (recommended)
    const product = await Product.findOneAndUpdate(
      { _id: productId, vendor: vendorId },
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or access denied" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
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
      subCategory,
      stock,
      status,
      discount,
      isDeleted,
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
        subCategory: subCategory || null,
        stock: stock || 0,
        status: status || "active",
        discount: discount || 0,
        isDeleted: !!isDeleted,
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
    console.error("Update product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const productId = req.params.id;

    const product = await Product.findOne({
      _id: productId,
      vendor: vendorId,
      isDeleted: false,
    }).populate("vendor", "name businessName email");

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or access denied", product: null });
    }

    res.json({ product });
  } catch (err) {
    console.error("Get single product error:", err);
    res.status(500).json({ message: "Server error", product: null });
  }
};
