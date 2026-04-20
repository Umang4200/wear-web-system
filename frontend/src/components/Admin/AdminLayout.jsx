import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { MdMenu } from "react-icons/md";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
    // Close sidebar on navigation (mobile)
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="w-full flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white z-50">
        <MdMenu 
          className="text-2xl text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
          WEAR WEB <span className="font-sans text-sm font-medium tracking-widest text-secondary ml-2">ADMIN</span>
        </h1>
      </div>

      {/* Body Section */}
      <div className="flex flex-1 overflow-hidden bg-gray-50 relative">
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar container with drawer logic */}
        <div className={`
          absolute lg:static inset-y-0 left-0 z-40
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
          w-64 h-full bg-white border-r border-gray-200
        `}>
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;