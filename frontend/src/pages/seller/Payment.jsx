import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

export default function Payment() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/order/seller-orders");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalEarning = orders
    .filter(order => order.orderStatus !== "Cancelled")
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const lastPayment = orders.length > 0 ? orders[0].totalAmount : 0;

  if (loading) {
     return <div className="flex justify-center items-center h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
       {/* Top Dashboard Cards */}
       <div className="mb-8">
         <div className="bg-white p-6 rounded-md shadow-sm w-full md:w-[400px]">
           <p className="text-gray-500 font-medium tracking-wide">Total Earning</p>
           <h2 className="text-3xl font-semibold text-gray-900 mt-2">₹{totalEarning.toLocaleString()}</h2>
           <hr className="my-4 border-gray-100" />
           <p className="text-sm font-medium text-gray-500">Last Payment : <span className="text-gray-900">₹{lastPayment.toLocaleString()}</span></p>
         </div>
       </div>

       <h2 className="text-xl font-semibold mb-4">Transactions</h2>

       {/* Header */}
       <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.5fr] bg-primary text-white p-3 rounded-md font-semibold text-md gap-6 flex-1">
         <p className="pl-2">Date</p>
         <p>Customer Details</p>
         <p>Order ID</p>
         <p>Method</p>
         <p className="text-right pr-2">Amount</p>
       </div>

       {/* Transaction List */}
       <div className="space-y-4 mt-4">
         {orders.length === 0 ? (
            <div className="bg-white rounded-md shadow-sm p-8 text-center text-gray-500 font-medium">
               No transactions found.
            </div>
         ) : (
           orders.map((order, index) => (
             <div key={index} className="bg-white rounded-md shadow-sm p-4">
               
               {/* Desktop Layout */}
               <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_0.8fr_0.5fr] items-center gap-6">
                 <div className="pl-2">
                    <p className="font-medium text-gray-900 text-[15px]">
                       {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                       {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </p>
                 </div>
                 <div>
                    <p className="font-medium text-gray-900 capitalize text-[15px]">{order.userId?.name || "N/A"}</p>
                    <p className="text-sm text-gray-700 mt-1">{order.userId?.email || "N/A"}</p>
                    <p className="text-xs text-gray-500 mt-1 tracking-wide">{order.userId?.mobile || order.addressId?.mobile || "N/A"}</p>
                 </div>
                 <div>
                    <p className="text-gray-500 text-[14px]">
                       <span className="font-medium text-gray-900 break-all">{order._id}</span>
                    </p>
                 </div>
                 <div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${order.paymentMethod === "Online" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                       {order.paymentMethod || "COD"}
                    </span>
                 </div>
                 <div className="text-right pr-2">
                    <p className="text-[15px] font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                 </div>
               </div>

               {/* Mobile Layout */}
               <div className="md:hidden space-y-3">
                 <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                       <p className="font-medium text-gray-900 text-sm">
                         {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                       </p>
                       <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${order.paymentMethod === "Online" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                             {order.paymentMethod || "COD"}
                          </span>
                       </div>
                    </div>
                    <p className="text-[15px] font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="font-medium text-gray-900 text-sm capitalize">{order.userId?.name || "N/A"}</p>
                    <p className="text-xs text-gray-600 truncate">{order.userId?.email || "N/A"}</p>
                 </div>
                 <div>
                    <p className="text-gray-500 text-xs text-wrap break-all">Order Id : <span className="font-medium text-gray-900">{order._id}</span></p>
                 </div>
               </div>

             </div>
           ))
         )}
       </div>
    </div>
  );
}
