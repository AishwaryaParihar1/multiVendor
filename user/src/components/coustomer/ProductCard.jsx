// ProductCard.jsx
import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../utils/api";
import SweetAlertService from "../ui/SweetAlertService";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      SweetAlertService.showInfo("Please login to add products to your cart!");
      navigate("/login");
      return;
    }
    try {
      await API.post("/cart/add", { productId: product._id, quantity: 1 });
      SweetAlertService.showSuccess("Added to cart!");
    } catch (err) {
      if (err.response?.data?.message?.includes("already")) {
        SweetAlertService.showInfo("Product is already in your cart.");
      } else {
        SweetAlertService.showError("Failed to add to cart.");
      }
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      SweetAlertService.showInfo("Please login to add products to your wishlist!");
      navigate("/login");
      return;
    }
    try {
      await API.post("/wishlist/add", { productId: product._id });
      SweetAlertService.showSuccess("Added to wishlist!");
    } catch (err) {
      if (err.response?.data?.message?.includes("already")) {
        SweetAlertService.showInfo("Product is already in your wishlist.");
      } else {
        SweetAlertService.showError("Failed to add to wishlist.");
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-72 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Large + Focus */}
      <div className="relative h-72 w-full">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        {isLoggedIn && (
          <button
            title="Add to Wishlist"
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-sm 
                       hover:bg-gray-800 hover:text-white transition-all"
            onClick={handleAddToWishlist}
          >
            <Heart size={18} className="text-secondary" />
          </button>
        )}
      </div>

      {/* Content minimal */}
      <div className="p-4 flex bg-[#E5E2D9] flex-col">
        <h3
          className="font-medium text-sm text-gray-900 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 mt-1 min-h-[32px]">
          {product.description}
        </p>

        {/* Price + Cart */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            ₹{product.sellingPrice}
          </div>
          {isLoggedIn && (
            <button
              title="Add to Cart"
              className="flex items-center gap-1 bg-secondary text-white px-3 py-1.5 rounded-full 
                         text-xs font-medium hover:bg-gray-800 transition-colors"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={14} />
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
