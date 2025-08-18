const Wishlist = require("../models/Wishlist");

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
    if (!wishlist) return res.json({ products: [] });
    res.json(wishlist);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    await wishlist.save();
    res.json(wishlist);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
