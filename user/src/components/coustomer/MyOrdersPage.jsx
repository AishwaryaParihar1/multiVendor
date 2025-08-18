import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/order/my");
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-700">Loading your orders…</div>;

  if (!orders.length)
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">You haven't placed any orders yet.</h2>
        <p className="text-gray-500">Orders you place will appear here.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-cinzel font-bold mb-10 text-secondary text-center">
        My Orders
      </h2>
      <div className="space-y-6">
        {orders.map((order, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={order._id}
              className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Order Header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 cursor-pointer"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              >
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-primary">Order ID:</span>{" "}
                    {order._id}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-semibold text-primary">Placed:</span>{" "}
                    {new Date(order.createdAt || order.placedAt).toLocaleString()}
                  </div>
                </div>

                {/* Status + Expand Icon */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.orderStatus === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                  <span className="ml-1 text-gray-500">
                    {isExpanded ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </div>
              </div>

              {/* Expandable Content with Animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-6 border-t pt-4">
                  {/* Products */}
                  <h4 className="font-semibold mb-3 text-gray-800">Products</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 border rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <img
                          src={item.product?.images?.[0] || "/placeholder.png"}
                          alt={item.product?.name}
                          className="h-16 w-16 object-cover rounded-lg shadow-sm"
                        />
                        <div className="flex-grow">
                          <div className="font-bold text-primary">{item.product?.name}</div>
                          <div className="text-xs text-gray-500">
                            Vendor: {item.vendor?.businessName || "N/A"} (
                            {item.vendor?.name || "Vendor"})
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            Qty: <span className="font-semibold">{item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-accent text-lg font-bold">
                          ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-sm text-gray-600">
                      Payment: {order.paymentMethod?.toUpperCase()}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      Order Total: ₹{order.totalAmount && order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Shipping Info */}
                  <div className="text-xs text-gray-500 mt-3 leading-relaxed">
                    Shipping: {order.shippingAddress?.fullName},{" "}
                    {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}, {order.shippingAddress?.country},{" "}
                    {order.shippingAddress?.postalCode}, Phone:{" "}
                    {order.shippingAddress?.phone}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
