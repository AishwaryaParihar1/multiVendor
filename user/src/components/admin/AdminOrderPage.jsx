import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // API must be: /api/order/all (protected for admin)
      const res = await API.get("/order/all");
      setOrders(res.data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="p-6 text-center text-gray-700">Loading all orders…</div>;

  if (!orders.length)
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">No orders have been placed yet.</h2>
        <p>Once customers place orders, they will show here.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-primary">All Orders (Admin)</h2>
      <div className="space-y-7">
        {orders.map((order, idx) => (
          <div key={order._id} className="rounded-xl shadow-lg bg-white p-5">
            {/* Order Header: Collapsible */}
            <div
              className="flex flex-col md:flex-row md:items-center justify-between gap-2 cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <div className="flex-1">
                <span className="font-semibold text-primary">Order ID:</span>
                <span className="ml-2 text-gray-800">{order._id}</span>
                <span className="ml-6 font-semibold text-primary">Placed At:</span>
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
            {/* Details: Accordion */}
            {expandedIndex === idx && (
              <div className="mt-4 border-t pt-4">
                <div className="flex flex-col md:flex-row md:gap-10">
                  {/* Products & Vendor details */}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2 text-gray-800">Products & Vendors</h4>
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
                            <div className="text-xs text-gray-500 line-clamp-1">
                              Vendor: {item.vendor?.businessName || "N/A"} (
                              {item.vendor?.name})<br />
                              Email: {item.vendor?.email}
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
                  </div>
                  {/* Customer & Shipping Info */}
                  <div className="flex-1 mt-4 md:mt-0">
                    <h4 className="font-semibold mb-2 text-gray-800">Customer</h4>
                    <div className="mb-2">
                      <span className="font-semibold">Name:</span>{" "}
                      {order.user?.name}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Email:</span>{" "}
                      {order.user?.email}
                    </div>
                    <h4 className="font-semibold mt-3 mb-2 text-gray-800">Shipping Address</h4>
                    <div className="text-sm text-gray-800">
                      <div>{order.shippingAddress?.fullName}</div>
                      <div>{order.shippingAddress?.address}</div>
                      <div>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state},{" "}
                        {order.shippingAddress?.country} - {order.shippingAddress?.postalCode}
                      </div>
                      <div>Phone: {order.shippingAddress?.phone}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="text-xl font-bold text-primary">
                    Order Total: ₹{order.totalAmount && order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Payment: {order.paymentMethod?.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
