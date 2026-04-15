import React, { useEffect, useState } from "react";
import {
  MdInventory,
  MdShoppingCart,
  MdAttachMoney,
  MdPendingActions,
} from "react-icons/md";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../AxiosInstance";

export default function SellerDashboard() {
  const [statsData, setStatsData] = useState({
    productsCount: 0,
    ordersCount: 0,
    revenue: 0,
    pendingOrders: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch products and orders in parallel
        const [productsRes, ordersRes] = await Promise.all([
          axiosInstance.get("/product/product-by-seller").catch(() => ({ data: { data: [] } })),
          axiosInstance.get("/order/seller-orders").catch(() => ({ data: { data: [] } })),
        ]);

        const products = productsRes.data?.data || [];
        const orders = ordersRes.data?.data || [];

        let revenue = 0;
        let pendingOrders = 0;

        orders.forEach((order) => {
          revenue += order.totalAmount;
          if (order.status === "Pending") {
            pendingOrders += 1;
          }
        });

        setStatsData({
          productsCount: products.length,
          ordersCount: orders.length,
          revenue: revenue,
          pendingOrders: pendingOrders,
        });

        // Compute chart data grouping by month
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const salesByMonth = {};

        orders.forEach((order) => {
          const d = new Date(order.createdAt);
          const monthName = months[d.getMonth()];
          if (!salesByMonth[monthName]) salesByMonth[monthName] = 0;
          salesByMonth[monthName] += order.totalAmount;
        });

        // Always show the first 6 months (January to June) to maintain a static yearly baseline
        const chartData = [];

        for (let i = 0; i <= 5; i++) {
          const monthName = months[i];
          chartData.push({
            month: monthName,
            sales: salesByMonth[monthName] || 0,
          });
        }

        setSalesData(chartData);
      } catch (error) {
        console.error("Dashboard loading error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: statsData.productsCount,
      icon: <MdInventory size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Orders",
      value: statsData.ordersCount,
      icon: <MdShoppingCart size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${statsData.revenue.toLocaleString()}`,
      icon: <MdAttachMoney size={28} />,
      color: "bg-green-100 text-green-600",
    },
    
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-2 md:p-0">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Seller Dashboard
      </h2>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm font-medium tracking-wide">{item.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {item.value}
              </h3>
            </div>

            <div className={`p-3 rounded-lg ${item.color}`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ================= SALES OVERVIEW ================= */}
      {/* flex-1 makes it take remaining height */}
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6 min-h-[400px] flex flex-col">
        <h3 className="text-lg font-semibold mb-4">
          Sales Overview
        </h3>

        {/* Chart fills remaining card height */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#1a1a1a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}