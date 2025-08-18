import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import SweetAlertService from "../ui/SweetAlertService"; // apka alert service import

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
    <div className="w-56 bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow duration-300 cursor-pointer group relative">
      <div className="relative">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="h-40 w-full object-cover rounded-lg transition-transform transform group-hover:scale-105"
        />
        {isLoggedIn && (
          <button
            title="Add to Wishlist"
            className="absolute top-3 right-3 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-accent hover:text-white transition-colors"
            onClick={handleAddToWishlist}
          >
            <Heart size={20} />
          </button>
        )}
      </div>

      <h3
        title={product.name}
        className="mt-4 font-bold text-lg text-primary truncate"
      >
        {product.name}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mt-1 min-h-[40px]">
        {product.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div className="text-accent font-extrabold text-xl">
          ₹{product.sellingPrice}
        </div>
        {isLoggedIn && (
          <button
            title="Add to Cart"
            className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-secondary transition-colors shadow hover:shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
