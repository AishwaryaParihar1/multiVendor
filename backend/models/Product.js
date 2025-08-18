const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  mrp: Number,
  sellingPrice: Number,
  images: [String],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  categories: [{ type: String }],
  
  // Flags for display sections
  isTrending: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  releaseDate: { type: Date, default: Date.now }, // For New Arrivals sorting
});

module.exports = mongoose.model("Product", productSchema);
