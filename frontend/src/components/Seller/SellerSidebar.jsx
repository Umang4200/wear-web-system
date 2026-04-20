import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingBag,
  MdInventory2,
  MdAdd,
  MdPayment,
  MdReceiptLong,
  MdPerson,
  MdLogout,
} from "react-icons/md";
import { toast } from "react-toastify";

function SellerSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: <MdDashboard /> },
    { name: "Orders", path: "orders", icon: <MdShoppingBag /> },
    { name: "Products", path: "products", icon: <MdInventory2 /> },
    { name: "Add Product", path: "addproduct", icon: <MdAdd /> },
    { name: "Payment", path: "payment", icon: <MdPayment /> },
    // { name: "Transaction", path: "transaction", icon: <MdReceiptLong /> },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto no-scrollbar">

      {/* Menu */}
      <div className="mt-8 flex flex-col gap-7 px-5">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 text-[15px] font-semibold transition-all border-l-4 ${
                isActive
                  ? "border-secondary text-secondary bg-soft-beige"
                  : "border-transparent text-gray-600 hover:text-secondary hover:bg-gray-50"
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            `flex items-center gap-4 px-6 py-4 text-[15px] font-semibold transition-all border-l-4 ${
              isActive
                ? "border-secondary text-secondary bg-soft-beige"
                : "border-transparent text-gray-600 hover:text-secondary hover:bg-gray-50"
            }`
          }
        >
          <MdPerson className="text-xl" />
          Account
        </NavLink>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
            toast.success("Logout successfully");
          }}
          className="flex items-center gap-4 px-6 py-4 text-[15px] font-semibold border-l-4 border-transparent text-gray-600 hover:text-secondary hover:bg-gray-50 transition-all w-full text-left"
        >
          <MdLogout className="text-xl" />
          Logout
        </button>
      </div>

    </div>
  );
}

export default SellerSidebar;