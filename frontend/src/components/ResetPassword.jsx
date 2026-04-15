import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosInstance";
import { assets } from "../assets/assets";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const { email, otp } = location.state || {};

  useEffect(() => {
    // If user accesses this page directly without going through Forgot Password logic
    if (!email || !otp) {
      toast.error("Invalid session. Please request a new OTP.");
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/user/reset-password", { 
        email, 
        otp, 
        newPassword: passwords.newPassword, 
        confirmPassword: passwords.confirmPassword 
      });

      if (response.data.success) {
        toast.success(response.data.message || "Password reset successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
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
            Reset Password
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Create a strong new password for your account.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
            
            {/* NEW PASSWORD */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 uppercase mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwords.newPassword}
                  onChange={handleInput}
                  required
                  className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={handleInput}
                  required
                  className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash size={16}/> : <FaRegEye size={16}/>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors shadow-sm mt-2 disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

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

export default ResetPassword;
