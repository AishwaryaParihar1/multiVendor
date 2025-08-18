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
        <p>Orders you place will appear here.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary">My Orders</h2>
      <div className="space-y-7">
        {orders.map((order, idx) => (
          <div key={order._id} className="rounded-xl shadow-lg bg-white p-5">
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <div>
                <span className="font-semibold text-primary">Order ID:</span>
                <span className="ml-2 text-gray-800">{order._id}</span>
                <span className="ml-6 font-semibold text-primary">Placed:</span>
                <span className="ml-2 text-gray-700">
                  {new Date(order.createdAt || order.placedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
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
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus.toUpperCase()}
                </span>
                <span className="ml-1">
                  {expandedIndex === idx ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
            </div>
            {expandedIndex === idx && (
              <div className="mt-4 border-t pt-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-800">Products</h4>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 border rounded-lg p-3 bg-gray-50"
                      >
                        <img
                          src={item.product?.images?.[0] || "/placeholder.png"}
                          alt={item.product?.name}
                          className="h-14 w-14 object-cover rounded-md"
                        />
                        <div className="flex-grow">
                          <div className="font-bold text-primary">{item.product?.name}</div>
                          <div className="text-xs text-gray-500">
                            Vendor: {item.vendor?.businessName || "N/A"} ({item.vendor?.name || "Vendor"})
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
                  <div className="mt-6 flex justify-end">
                    <span className="text-xl font-bold text-primary">
                      Order Total: ₹{order.totalAmount && order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Payment: {order.paymentMethod?.toUpperCase()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Shipping: {order.shippingAddress?.fullName},{" "}
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state}, {order.shippingAddress?.country},{" "}
                  {order.shippingAddress?.postalCode}, Phone: {order.shippingAddress?.phone}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
