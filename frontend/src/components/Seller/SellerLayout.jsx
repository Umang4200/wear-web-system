import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import axiosInstance from "../../AxiosInstance";
import { MdMenu, MdHourglassEmpty, MdLogout, MdErrorOutline } from "react-icons/md";
import Button from "../UI/Button";

function SellerLayout() {
  const [status, setStatus] = useState("pending"); // pending, approved, rejected
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      const seller = res.data.data.fetchedSeller;
      if (seller) {
        setStatus(seller.status || "pending");
      }
    } catch (error) {
      console.error("Verification check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
        <p className="text-gray-500 font-medium tracking-widest text-xs uppercase text-center px-4">
          Securing Seller Session...
        </p>
      </div>
    );
  }

  // REJECTED SCREEN
  if (status === "rejected") {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="w-full flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
            WEAR WEB <span className="font-sans text-sm font-medium tracking-widest text-secondary ml-2">SELLER</span>
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-100 p-10 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdErrorOutline className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Rejected</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We regret to inform you that your seller application has been rejected by our administration.
              You will not be able to access the seller dashboard at this time.
            </p>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "mailto:support@wearweb.com"}
                className="w-full py-3"
              >
                Contact Support
              </Button>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-red-600 font-semibold transition-colors py-2"
              >
                <MdLogout className="text-lg" /> Logout & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PENDING SCREEN
  if (status !== "approved") {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <div className="w-full flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
            WEAR WEB <span className="font-sans text-sm font-medium tracking-widest text-secondary ml-2">SELLER</span>
          </h1>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdHourglassEmpty className="text-4xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Approval Pending</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your seller account is currently being reviewed by our administrators. 
              Please check back soon for access to your seller dashboard.
            </p>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={checkVerification}
                className="w-full py-3"
              >
                Check Status Again
              </Button>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-red-600 font-semibold transition-colors py-2"
              >
                <MdLogout className="text-lg" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="w-full flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white">
        <MdMenu className="text-2xl text-gray-600 cursor-pointer" />
        <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
          WEAR WEB <span className="font-sans text-sm font-medium tracking-widest text-secondary ml-2">SELLER</span>
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden bg-gray-50">
        <SellerSidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default SellerLayout;
