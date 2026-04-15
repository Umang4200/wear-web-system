import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";

function CustomerProfileSidebar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user/profile");
        setUserName(res.data.data.userObj.name);
      } catch (error) {
        setUserName("Customer");
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { name: "Profile", path: "profile" },
    { name: "Orders", path: "orders" },
    { name: "Addresses", path: "addresses" },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="w-full lg:w-64 bg-white lg:border-r lg:border-gray-100 min-h-screen py-8 flex flex-col">
      <div className="px-6 mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Account</h2>
        <p className="text-xs text-gray-500 mt-1 capitalize">{userName}</p>
      </div>

      <div className="flex flex-col">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `block px-6 py-4 text-[15px] font-semibold transition-all border-l-4 ${
                isActive
                  ? "border-secondary text-secondary bg-soft-beige"
                  : "border-transparent text-gray-600 hover:text-black hover:bg-gray-50"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

        {/* Top/Inline Side Logout Button as per user request */}
        <button
          onClick={logoutHandler}
          className="w-full text-left px-6 py-4 text-[15px] font-semibold border-l-4 border-transparent text-red-600 hover:text-secondary hover:bg-gray-50 transition-all flex items-center justify-between"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CustomerProfileSidebar;
