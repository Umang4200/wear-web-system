import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdGroup,
  MdStorefront,
  MdCategory,
  MdLogout,
  MdPerson,
} from "react-icons/md";

function AdminSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
    { name: "Users", path: "/admin/users", icon: <MdGroup /> },
    { name: "Sellers", path: "/admin/sellers", icon: <MdStorefront /> },
    { name: "Categories", path: "/admin/categories", icon: <MdCategory /> },
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
          to="/admin/profile"
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

export default AdminSidebar;