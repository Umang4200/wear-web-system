import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { assets } from "../assets/assets";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosInstance";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  const [role, setRole] = useState("customer");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // validation schemas omitted for brevity, keeping existing
  const validateSchema = {
    nameValidator: { required: { value: true, message: "Name is required" } },
    emailValidator: {
      required: { value: true, message: "Email is required" },
      pattern: { value: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, message: "Please enter a valid email address" },
    },
    passwordValidator: {
      required: { value: true, message: "Password is required" },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "Minimum 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special character required.",
      },
    },
    shopNameValidator: { required: { value: true, message: "Shop name is required" } },
    businessEmailValidator: {
      required: { value: true, message: "Business email is required" },
      pattern: { value: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, message: "Enter a valid business email" },
    },
    gstValidator: { required: { value: true, message: "GST number is required" } },
    areaValidator: { required: { value: true, message: "Address is required" } },
    cityValidator: { required: { value: true, message: "City is required" } },
    stateValidator: { required: { value: true, message: "State is required" } },
    pincodeValidator: {
      required: { value: true, message: "Pincode is required" },
      pattern: { value: /^[0-9]{6}$/, message: "Enter valid 6 digit pincode" },
    },
  };

  async function onSubmitHandler(data) {
    try {
      data.role = role;
      const response = await axiosInstance.post("/user/register", data);
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  }

  async function nextStep() {
    if (step === 1) {
      const isValid = await trigger(["name", "email", "password"]);
      if (!isValid) return;
    }
    if (step === 2) {
      const isValid = await trigger(["shopName", "businessEmail", "gstNumber"]);
      if (!isValid) return;
    }
    setStep(step + 1);
  }

  function prevStep() {
    setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 lg:py-20">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2 min-h-[650px] border border-gray-100">
        
        {/* LEFT IMAGE */}
        <div className="relative hidden md:block group">
          <img
            src={assets.sign_img}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            alt="fashion"
          />
          <div className="absolute inset-0 bg-primary/40 flex flex-col items-center justify-center text-white text-center px-6">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">WEAR WEB</h1>
            <p className="text-sm font-medium tracking-wide uppercase">
              Join the Movement
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-6 tracking-tight">
            Create Account
          </h2>

          {/* ROLE TOGGLE */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              type="button"
              className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                role === "customer" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-black"
              }`}
              onClick={() => {
                setRole("customer");
                setStep(1);
              }}
            >
              Customer
            </button>
            <button
              type="button"
              className={`w-1/2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                role === "seller" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-black"
              }`}
              onClick={() => {
                setRole("seller");
                setStep(1);
              }}
            >
              Seller
            </button>
          </div>

          {/* STEP INDICATOR (SELLER) */}
          {role === "seller" && (
            <div className="flex justify-between text-xs uppercase tracking-widest text-gray-400 mb-8 px-4">
              <span className={`${step === 1 ? "text-black font-bold" : "font-medium"}`}>Account</span>
              <span className={`${step === 2 ? "text-black font-bold" : "font-medium"}`}>Business</span>
              <span className={`${step === 3 ? "text-black font-bold" : "font-medium"}`}>Address</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300 space-y-5">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register("name", validateSchema.nameValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", validateSchema.emailValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      {...register("password", validateSchema.passwordValidator)}
                      className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                    <div
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                    </div>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
                </div>

                {role === "seller" ? (
                  <button type="button" onClick={nextStep} className="w-full bg-primary text-white py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-4">
                    Next Step
                  </button>
                ) : (
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-4">
                    Join Wear Web
                  </button>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && role === "seller" && (
              <div className="animate-in fade-in duration-300 space-y-5">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Shop Name</label>
                  <input
                    type="text" placeholder="Enter shop name"
                    {...register("shopName", validateSchema.shopNameValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.shopName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.shopName.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Business Email</label>
                  <input
                    type="email" placeholder="Enter business email"
                    {...register("businessEmail", validateSchema.businessEmailValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.businessEmail && <p className="text-red-500 text-xs mt-1 font-medium">{errors.businessEmail.message}</p>}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">GST Number</label>
                  <input
                    type="text" placeholder="Enter GST Number"
                    {...register("gstNumber", validateSchema.gstValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.gstNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gstNumber.message}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={prevStep} className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-bold uppercase w-1/3 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={nextStep} className="px-6 py-4 bg-primary text-white rounded-full text-sm font-bold uppercase tracking-widest flex-1 hover:bg-gray-800 transition-colors">
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && role === "seller" && (
              <div className="animate-in fade-in duration-300 space-y-5">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Area / Street</label>
                  <input
                    type="text" placeholder="Locality"
                    {...register("area", validateSchema.areaValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.area && <p className="text-red-500 text-xs mt-1 font-medium">{errors.area.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 uppercase mb-2">City</label>
                    <input
                       type="text" placeholder="City"
                       {...register("city", validateSchema.cityValidator)}
                       className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city.message}</p>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 uppercase mb-2">State</label>
                    <input
                       type="text" placeholder="State"
                       {...register("state", validateSchema.stateValidator)}
                       className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-gray-600 uppercase mb-2">Pincode</label>
                  <input
                    type="text" placeholder="Pincode"
                    {...register("pincode", validateSchema.pincodeValidator)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                  />
                  {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode.message}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={prevStep} className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-bold uppercase w-1/3 transition-colors">
                    Back
                  </button>
                  <button type="submit" className="px-6 py-4 bg-primary text-white rounded-full text-sm font-bold uppercase tracking-widest flex-1 hover:bg-gray-800 transition-colors">
                    Submit
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* LOGIN LINK */}
          <div className="mt-8 text-center pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Already have an account?
              <Link to="/login" className="text-black ml-2 font-bold hover:underline underline-offset-4">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
