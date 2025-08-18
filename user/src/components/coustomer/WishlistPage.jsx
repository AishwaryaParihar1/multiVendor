import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data);
    } catch {
      setWishlist({ products: [] });
    } finally {
      setLoading(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    setUpdating(true);
    try {
      await API.delete(`/wishlist/remove/${productId}`);
      setWishlist((cur) => ({
        ...cur,
        products: cur.products.filter((p) => p._id !== productId),
      }));
    } finally {
      setUpdating(false);
    }
  };

  // Add product from wishlist to cart
  const addToCart = async (productId) => {
    setUpdating(true);
    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      alert("Added to cart!");
    } catch {
      alert("Failed to add product to cart.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-700">Loading wishlist...</div>;

  if (wishlist.products.length === 0)
    return (
      <div className="p-6 text-center text-gray-700">
        <h2 className="text-3xl font-semibold mb-4">Your wishlist is empty</h2>
        <p>Add products to your wishlist to see them here.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Wishlist</h2>
      <ul className="space-y-6">
        {wishlist.products.map((prod) => (
          <li
            key={prod._id}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white shadow rounded-lg p-4 gap-4"
          >
            <img
              src={prod.images?.[0] || "/placeholder.png"}
              alt={prod.name}
              className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-primary">{prod.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mt-1 min-h-[40px]">{prod.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-lg font-bold text-accent">₹{prod.sellingPrice}</div>
                <button
                
                  onClick={() => addToCart(prod._id)}
                  disabled={updating}
                  className="flex items-center gap-2 bg-primary hover:bg-secondary text-white py-2 px-4 rounded-xl shadow font-semibold transition"
                  title="Add to Cart"
                  aria-label={`Add ${prod.name} to cart`}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(prod._id)}
                  disabled={updating}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Remove from Wishlist"
                  aria-label={`Remove ${prod.name} from wishlist`}
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
