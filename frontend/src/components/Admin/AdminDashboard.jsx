import React, { useEffect, useState } from "react";
import StatsCard from "../UI/StatsCard";
import axiosInstance from "../../AxiosInstance";
import { MdGroup, MdStorefront, MdShoppingCart, MdAttachMoney } from "react-icons/md";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#4F46E5", "#A855F7", "#EC4899", "#EAB308"];

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    salesTrend: [],
    userDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/dashboard-stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium tracking-wide">Synthesizing Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h2>
        {/* <p className="text-gray-500 mt-2 font-medium">Platform performance and demographic analytics overview.</p> */}
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={<MdGroup />}
          colorClass="text-indigo-600 bg-indigo-50"
        />
        <StatsCard
          title="Verified Sellers"
          value={stats.totalSellers}
          icon={<MdStorefront />}
          colorClass="text-purple-600 bg-purple-50"
        />
        <StatsCard
          title="Gross Orders"
          value={stats.totalOrders}
          icon={<MdShoppingCart />}
          colorClass="text-pink-600 bg-pink-50"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<MdAttachMoney />}
          colorClass="text-amber-600 bg-amber-50"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* REVENUE TREND */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Performance</h3>
              {/* <p className="text-sm text-gray-500">Gross revenue trends over the last 7 days</p> */}
            </div>
            <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Weekly View
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesTrend}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* USER DISTRIBUTION */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900">User Demographics</h3>
            {/* <p className="text-sm text-gray-500">Breakdown of platform participants</p> */}
          </div>
          
          <div className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={200}
                >
                  {stats.userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
