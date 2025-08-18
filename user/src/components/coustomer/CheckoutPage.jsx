import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import SweetAlertService from "../ui/SweetAlertService";

export default function CheckoutPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod", // cod=Cash On Delivery, card=Credit/Debit Card
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.sellingPrice,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.country.trim() ||
      !form.postalCode.trim() ||
      !form.phone.trim()
    ) {
      SweetAlertService.showError("Please fill all the required fields");
      return false;
    }
    if (cart.items.length === 0) {
      SweetAlertService.showInfo("Your cart is empty");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;
    setPlacingOrder(true);
    try {
      // Example POST payload - adjust according to your backend API
      const orderData = {
        cartId: cart._id,
        shippingDetails: { ...form },
        totalAmount,
      };
      await API.post("/order/create", orderData);
      SweetAlertService.showSuccess("Order placed successfully!");
      setCart({ items: [] }); // Clear cart locally (optional)
    } catch {
      SweetAlertService.showError("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-700">
        <h2 className="text-2xl font-semibold">Loading your cart...</h2>
      </div>
    );

  if (cart.items.length === 0)
    return (
      <div className="p-6 text-center text-gray-700">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p>Add products to cart before checkout.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Shipping Details Form */}
        <form className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            required
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <input
            type="text"
            name="state"
            placeholder="State/Province"
            value={form.state}
            onChange={handleChange}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />

          <h2 className="mt-6 mb-2 text-xl font-semibold text-gray-800">Payment Method</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === "cod"}
                onChange={handleChange}
                className="form-radio"
              />
              <span>Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={form.paymentMethod === "card"}
                onChange={handleChange}
                className="form-radio"
              />
              <span>Credit/Debit Card</span>
            </label>
          </div>
        </form>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-auto">
            {cart.items.map(({ product, quantity }) => (
              <li key={product._id} className="flex items-center py-4 gap-4">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-20 h-20 rounded object-cover flex-shrink-0"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-600 line-clamp-2">{product.description}</p>
                  <p className="mt-1 text-sm text-gray-700">Qty: {quantity}</p>
                </div>
                <div className="text-lg font-bold text-accent">
                  ₹{(product.sellingPrice * quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-4 flex justify-between text-2xl font-bold text-gray-900">
            <span>Total:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="mt-8 w-full py-4 bg-primary text-white rounded-xl hover:bg-secondary transition-colors text-lg font-semibold"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
