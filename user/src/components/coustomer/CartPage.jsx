import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Trash2, PlusCircle, MinusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    setUpdating(true);
    try {
      await API.delete(`/cart/remove/${productId}`);
      setCart((cur) => ({
        ...cur,
        items: cur.items.filter((i) => i.product._id !== productId),
      }));
    } finally {
      setUpdating(false);
    }
  };

  // Increase quantity
  const increaseQty = async (productId) => {
    setUpdating(true);
    try {
      await API.post("/cart/add", { productId, quantity: 1 });
      setCart((cur) => {
        const updatedItems = cur.items.map((i) => {
          if (i.product._id === productId) return { ...i, quantity: i.quantity + 1 };
          return i;
        });
        return { ...cur, items: updatedItems };
      });
    } finally {
      setUpdating(false);
    }
  };

  // Decrease quantity
  const decreaseQty = async (productId) => {
    setUpdating(true);
    try {
      const item = cart.items.find((i) => i.product._id === productId);
      if (item.quantity <= 1) return; // prevent decreasing below 1
      await API.post("/cart/add", { productId, quantity: -1 }); // assuming backend supports negative qty to decrease
      setCart((cur) => {
        const updatedItems = cur.items.map((i) => {
          if (i.product._id === productId) return { ...i, quantity: i.quantity - 1 };
          return i;
        });
        return { ...cur, items: updatedItems };
      });
    } finally {
      setUpdating(false);
    }
  };

  // Calculate total price of cart
  const totalPrice = cart.items.reduce(
    (acc, i) => acc + i.quantity * i.product.sellingPrice,
    0
  );

  if (cart.items.length === 0)
    return (
      <div className="p-6 text-center text-gray-700">
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
        <p>Add items to your cart to see them here.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Cart</h2>
      <ul className="space-y-6">
        {cart.items.map(({ product, quantity }) => (
          <li
            key={product._id}
            className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white shadow rounded-lg p-4 gap-4"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mt-1">{product.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center border rounded-full overflow-hidden">
                  <button
                    onClick={() => decreaseQty(product._id)}
                    disabled={quantity <= 1 || updating}
                    className="px-3 py-1 text-primary hover:text-secondary disabled:text-gray-400 transition"
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle size={20} />
                  </button>
                  <span className="px-4 font-semibold">{quantity}</span>
                  <button
                    onClick={() => increaseQty(product._id)}
                    disabled={updating}
                    className="px-3 py-1 text-primary hover:text-secondary transition"
                    aria-label="Increase quantity"
                  >
                    <PlusCircle size={20} />
                  </button>
                </div>
                <div className="text-lg font-bold text-accent">
                  ₹{(product.sellingPrice * quantity).toFixed(2)}
                </div>
                <button
                  onClick={() => removeFromCart(product._id)}
                  disabled={updating}
                  className="text-red-600 hover:text-red-800 transition"
                  aria-label="Remove product"
                  title="Remove product"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-end items-center gap-6 border-t pt-6">
        <div className="text-xl font-bold text-gray-800">Total: ₹{totalPrice.toFixed(2)}</div>
        <button
          disabled={updating || cart.items.length === 0}
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          onClick={() => navigate("/checkoutPage")}  // Added navigate here for checkout
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
