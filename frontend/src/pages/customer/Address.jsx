import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { useForm } from "react-hook-form";

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const getAddresses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/address/get-address");
      setAddresses(res.data.data);
    } catch {
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  //  Submit (Add / Update)
  const onSubmit = async (data) => {
    try {
      if (editId) {
        await axiosInstance.put(`/address/update-address/${editId}`, data);
        toast.success("Address updated perfectly.");
      } else {
        await axiosInstance.post("/address/add-address", data);
        toast.success("New address added successfully.");
      }

      reset();
      setEditId(null);
      setShowForm(false);
      getAddresses();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  //  Delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/address/delete-address?addressId=${id}`);
      toast.success("Address deleted.");
      getAddresses();
    } catch {
      toast.error("Failed to delete address.");
    }
  };

  //  Edit
  const handleEdit = (addr) => {
    setValue("area", addr.area);
    setValue("city", addr.city);
    setValue("state", addr.state);
    setValue("pincode", addr.pincode);
    setValue("mobile", addr.mobile);

    setEditId(addr._id);
    setShowForm(true);
    setActiveMenu(null);
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0 pb-20">
      {/* Header Segment */}
      <div className="mb-8 border-b border-gray-200 pb-6 mt-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800  tracking-tight">Manage Addresses</h2>
        {/* <p className="text-gray-500 mt-2 text-sm tracking-wide">Manage your delivery addresses for a seamless checkout experience.</p> */}
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            reset();
          }}
          className="w-full border-2 border-dashed border-gray-200 hover:border-black transition-colors rounded-sm p-5 flex items-center justify-center gap-3 text-gray-500 hover:text-black font-semibold text-sm tracking-widest uppercase"
        >
          <FaPlus size={14} /> Add a New Address
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form
          className="bg-white border border-gray-200 p-8 rounded-sm mb-10 transition-all duration-300 shadow-sm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-black">
              {editId ? "Update Address" : "New Address Details"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Mobile Number</label>
              <input
                placeholder="Enter 10-digit mobile"
                {...register("mobile", { required: true })}
                className="border border-gray-200 focus:border-black rounded-none p-3 text-sm focus:outline-none transition-colors"
              />
              {errors.mobile && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter mt-1">Required</p>}
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pincode</label>
              <input
                placeholder="6-digit pincode"
                {...register("pincode", { required: true })}
                className="border border-gray-200 focus:border-black rounded-none p-3 text-sm focus:outline-none transition-colors"
              />
              {errors.pincode && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter mt-1">Required</p>}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">City / District</label>
              <input
                placeholder="City Name"
                {...register("city", { required: true })}
                className="border border-gray-200 focus:border-black rounded-none p-3 text-sm focus:outline-none transition-colors"
              />
              {errors.city && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter mt-1">Required</p>}
            </div>

            {/* State */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">State</label>
              <input
                placeholder="State Name"
                {...register("state", { required: true })}
                className="border border-gray-200 focus:border-black rounded-none p-3 text-sm focus:outline-none transition-colors"
              />
              {errors.state && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter mt-1">Required</p>}
            </div>

            {/* Area */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Area / Street / Locality</label>
              <textarea
                placeholder="Full address (House No, Building, Street)"
                {...register("area", { required: true })}
                rows={3}
                className="border border-gray-200 focus:border-black rounded-none p-3 text-sm focus:outline-none transition-colors resize-none"
              />
              {errors.area && <p className="text-red-500 text-[10px] font-bold uppercase tracking-tighter mt-1">Required</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10">
            <button className="bg-primary hover:bg-black text-white font-bold tracking-widest uppercase py-3.5 px-12 rounded-sm transition-all text-xs w-full md:w-auto min-w-[200px] shadow-sm">
              {editId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      <div className="space-y-6 mt-4">
        {addresses.length === 0 && !loading ? (
             <div className="text-center py-20 border border-dashed border-gray-200 rounded-sm">
                <p className="text-gray-400 text-sm italic font-medium uppercase tracking-widest">No addresses saved yet.</p>
             </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="bg-white border border-gray-200 rounded-sm hover:border-black transition-colors p-6 relative group shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-sm uppercase tracking-widest">
                      DELIVERY ADDRESS
                    </span>
                    <span className="text-sm font-bold text-black tracking-wide">{addr.mobile}</span>
                  </div>
                  <div className="text-[14px] leading-relaxed text-gray-700 max-w-lg">
                    <p className="font-semibold text-black uppercase text-[10px] tracking-widest mb-1 text-gray-400">Shipping Details</p>
                    <p className="capitalize">{addr.area}</p>
                    <p className="capitalize">{addr.city}, {addr.state} - <span className="font-bold text-black">{addr.pincode}</span></p>
                  </div>
                </div>

                {/* Desktop Actions (visible on hover) */}
                <div className="flex gap-4 items-center scale-90 md:scale-100">
                    <button
                      onClick={() => handleEdit(addr)}
                      className="text-[11px] font-bold text-black uppercase tracking-widest underline underline-offset-4 hover:text-gray-500 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="text-[11px] font-bold text-red-600 uppercase tracking-widest underline underline-offset-4 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
