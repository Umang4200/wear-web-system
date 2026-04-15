import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";

export default function Order() {
  const [ordersData, setOrdersData] = useState([]);
  const [activeSelect, setActiveSelect] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/order/seller-orders");
      if (res.data.success) {
        setOrdersData(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axiosInstance.put("/order/status", { orderId, status: newStatus });
      if (res.data.success) {
        toast.success("Order status updated");
        setOrdersData(ordersData.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
    } finally {
      setActiveSelect(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">All Orders</h2>

      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_2fr_1.5fr_1fr_1fr] bg-primary text-white p-3 rounded-md font-semibold">
        <p>Order Id</p>
        <p>Products</p>
        <p>Shipping Address</p>
        <p>Status</p>
        <p>Update</p>
      </div>

      {/* Orders */}
      {ordersData.map((order) => (
        <div key={order._id} className="bg-white mt-3 p-4 rounded-md shadow-sm">
          <div className="grid md:grid-cols-[1fr_2fr_1.5fr_1fr_1fr] gap-6 items-start">
            {/* Order ID */}
            <p className="text-md text-gray-700 break-all">{order._id}</p>

            {/* Products */}
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={item.productId?.imagePaths?.[0] || 'https://via.placeholder.com/80'}
                    className="w-20 h-24 object-cover rounded"
                    alt=""
                  />
                  <div className="text-md">
                    <p className="font-medium">{item.productId?.title || 'Unknown Product'}</p>
                    <p>Price: ₹{item.price}</p>
                    <p>Color: {item.productId?.colors?.[0] || 'N/A'}</p>
                    <p>Size: {item.productId?.size?.[0] || 'N/A'}, Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="text-md text-gray-700">
              <p className="font-medium">{order.userId?.name || "N/A"}</p>
              <p>{order.addressId?.area || "N/A"}</p>
              <p>{order.addressId?.city || "N/A"}</p>
              <p>
                {order.addressId?.state || "N/A"} - {order.addressId?.pincode || "N/A"}
              </p>
              <p className="mt-1 font-medium">
                Mobile: {order.addressId?.mobile || order.userId?.mobile || "N/A"}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <span
                className={`px-4 py-1 text-xs rounded-full border font-medium
                  ${
                    order.orderStatus === "Pending"
                      ? "text-yellow-600 border-yellow-400 bg-yellow-50"
                      : order.orderStatus === "Placed" || order.orderStatus === "Confirmed"
                        ? "text-green-600 border-green-400 bg-green-50"
                        : order.orderStatus === "Shipped"
                          ? "text-blue-600 border-blue-400 bg-blue-50"
                          : order.orderStatus === "Delivered"
                            ? "text-purple-600 border-purple-400 bg-purple-50"
                            : "text-gray-600 border-gray-300 bg-gray-50"
                  }
                `}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Update */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveSelect(activeSelect === order._id ? null : order._id)
                }
                className="text-green-600 font-semibold text-md"
              >
                STATUS
              </button>

              {activeSelect === order._id && (
                <div className="absolute right-0 top-8 w-40 bg-white shadow-lg rounded-md border z-50">
                  {[
                    "Pending",
                    "Placed",
                    "Shipped",
                    "Delivered",
                    "Cancelled",
                  ].map((statusOption) => (
                    <p
                      key={statusOption}
                      onClick={() =>
                        handleStatusChange(order._id, statusOption)
                      }
                      className="px-4 py-2 text-md hover:bg-gray-100 cursor-pointer"
                    >
                      {statusOption}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
