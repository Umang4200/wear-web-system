import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import CustomerProfileSidebar from "./CustomerProfileSidebar";

function CustomerProfileLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on mobile when navigating
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col bg-gray-50 border-t border-gray-100 relative">

      {/* Header (Mobile) */}
      <div className="lg:hidden w-full flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 z-50">
        <h1 className="text-lg font-bold tracking-tight text-gray-900 uppercase">My Account</h1>
        <button 
            className="p-2 -mr-2 text-black hover:bg-gray-50 rounded-full transition-colors"
            onClick={() => setShowSidebar(!showSidebar)}
        >
            {showSidebar ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full lg:py-10 lg:gap-8 lg:px-4">

        {/* Overlay (mobile only) */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:static z-40
            top-0 lg:top-0
            left-0
            h-full lg:h-auto
            w-72 sm:w-80 lg:w-64 bg-white shadow-2xl lg:shadow-none lg:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <CustomerProfileSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-visible w-full lg:bg-white lg:border lg:border-gray-100 lg:min-h-[60vh] p-4 sm:p-6 lg:p-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CustomerProfileLayout;