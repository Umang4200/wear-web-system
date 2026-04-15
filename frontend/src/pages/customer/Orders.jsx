import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order/my-orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const firstItemImage = order.items?.[0]?.productId?.imagePaths?.[0] || "https://via.placeholder.com/80";
            return (
              <div
                key={order._id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center hover:shadow-md transition"
              >
                {/* Left */}
                <div className="flex gap-4 items-center">
                  <img
                    src={firstItemImage}
                    alt="product"
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div>
                    <p className="font-semibold">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* Right */}
                <div className="text-right">
                  <p
                    className={`font-semibold ${order.orderStatus === "Delivered"
                        ? "text-green-600"
                        : "text-blue-600"
                      }`}
                  >
                    {order.orderStatus}
                  </p>

                  <button
                    onClick={() => navigate(`/profile/order/${order._id}`)}
                    className="mt-2 px-4 py-1 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}