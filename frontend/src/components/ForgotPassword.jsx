import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosInstance";
import { assets } from "../assets/assets";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/user/forgot-password", { email });
      if (response.data.success) {
        toast.success(response.data.message || "OTP sent to your email!");
        setOtpSent(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/user/verify-otp", { email, otp });
      if (response.data.success) {
        toast.success("OTP Verified Successfully!");
        navigate("/reset-password", { state: { email, otp } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 lg:py-20">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[600px] border border-gray-100">
        
        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden md:block group">
          <img
            src={assets.login_img}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt="fashion"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">WEAR WEB</h1>
            <p className="text-sm font-medium tracking-wide uppercase">
              Curating Modern Aesthetics
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            {!otpSent 
              ? "Enter your email address to receive a OTP for resetting your credentials." 
              : "An OTP has been sent to your email. Please enter it below to verify."}
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 mt-2"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none cursor-not-allowed"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-600 uppercase mb-2">6-Digit OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all tracking-widest text-center text-lg font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 mt-2"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* BACK TO LOGIN LINK */}
          <div className="mt-8 text-center pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Remembered your password?
              <Link to="/login" className="text-black ml-2 font-bold hover:underline underline-offset-4">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
