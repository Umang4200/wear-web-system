import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { assets } from "../assets/assets";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosInstance";

function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateSchema = {
    emailValidator: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "Please enter a valid email",
      },
    },

    passwordValidator: {
      required: {
        value: true,
        message: "Password is required",
      },
    },
  };

  async function onSubmitHandler(data) {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/user/login", data);

      if (response.status == 200) {
        const { role, message, token } = response.data;
        toast.success(message);

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        const userRole = role?.trim().toLowerCase();
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        switch (userRole) {
          case "customer":
            navigate("/");
            break;
          case "seller":
            navigate("/seller");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

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
          <div className="absolute inset-0 bg-primary/40 flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">WEAR WEB</h1>
            <p className="text-sm font-medium tracking-wide uppercase">
              Curating Modern Aesthetics
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Please enter your details to sign in.
          </p>

          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            {/* EMAIL */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", validateSchema.emailValidator)}
                className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", validateSchema.passwordValidator)}
                  className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash size={16}/> : <FaRegEye size={16}/>}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm font-medium text-gray-500 hover:text-black transition-colors underline underline-offset-4">
                  Forgot Password?
                </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-8 text-center pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Don't have an account?
              <Link to="/register" className="text-black ml-2 font-bold hover:underline underline-offset-4">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
