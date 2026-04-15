import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import { useForm } from "react-hook-form";

/* ================= REUSABLE MODAL ================= */
const ReusableModal = ({ open, title, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="absolute inset-0 backdrop-blur-sm bg-primary/5 flex justify-center items-center z-40">

      {/* overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl p-6 w-[90%] md:w-[420px] shadow-lg z-50">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default function SellerProfile() {

  const [userData, setUserData] = useState();
  const [sellerData, setSellerData] = useState();
  const [addressData, setAddressData] = useState();

  // ✅ ONE MODAL STATE FOR ALL
  const [activeModal, setActiveModal] = useState(null);

  const profileForm = useForm();
  const businessForm = useForm();
  const addressForm = useForm();
  const bankForm = useForm();

  const seller = {
    bankName: "HDFC Bank",
    accountNumber: "XXXXXX1234",
    ifsc: "HDFC0001234",
  };

  /* ================= FETCH ================= */
  const getUserDetails = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");

      setUserData(res.data.data.userObj);
      setSellerData(res.data.data.fetchedSeller);
      setAddressData(res.data.data.fetchedAddress);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (userData) profileForm.reset(userData);
  }, [userData]);

  useEffect(() => {
    if (sellerData)
      businessForm.reset({
        shopName: sellerData.shopName,
        gstNumber: sellerData.gstNumber,
      });
  }, [sellerData]);

  useEffect(() => {
    if (addressData) addressForm.reset(addressData);
  }, [addressData]);

  useEffect(() => {
    bankForm.reset(seller);
  }, []);

  /* ================= SUBMIT ================= */

  const closeModal = () => setActiveModal(null);

  const onProfileSubmit = (data) => {
    console.log("Profile:", data);
    closeModal();
  };

  const onBusinessSubmit = (data) => {
    console.log("Business:", data);
    closeModal();
  };

  const onAddressSubmit = (data) => {
    console.log("Address:", data);
    closeModal();
  };

  const onBankSubmit = (data) => {
    console.log("Bank:", data);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 relative">

      <div className="max-w-6xl mx-auto space-y-6">

        {/* ================= PROFILE ================= */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <button
            className="w-24 h-24 bg-primary text-4xl rounded-full text-white border"
          >
            {userData?.name.charAt(0).toUpperCase()}
          </button>

          <div className="flex-1">
            <h2 className="text-2xl font-bold">{userData?.name}</h2>
            <p className="text-gray-500">{userData?.email}</p>
            <p className="text-gray-500">{userData?.mobile}</p>
          </div>

          <button
            onClick={() => setActiveModal("profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        </div>

        {/* ================= BUSINESS ================= */}
        <Section
          title="Business Details"
          onEdit={() => setActiveModal("business")}
        >
          <Info label="Business Name" value={sellerData?.shopName} />
          <Info label="GST Number" value={sellerData?.gstNumber} />
          <Info label="Account Status" value={userData?.status} />
        </Section>

        {/* ================= ADDRESS ================= */}
        <Section
          title="Pickup Address"
          onEdit={() => setActiveModal("address")}
        >
          <Info label="Address" value={addressData?.area} />
          <Info label="City" value={addressData?.city} />
          <Info label="State" value={addressData?.state} />
          <Info label="Pincode" value={addressData?.pincode} />
        </Section>

        {/* ================= BANK ================= */}
        <Section
          title="Bank Details"
          onEdit={() => setActiveModal("bank")}
        >
          <Info label="Bank Name" value={seller.bankName} />
          <Info label="Account Number" value={seller.accountNumber} />
          <Info label="IFSC Code" value={seller.ifsc} />
        </Section>
      </div>

      {/* ================= SINGLE REUSABLE MODAL ================= */}
      <ReusableModal
        open={!!activeModal}
        title={`Edit ${activeModal || ""}`}
        onClose={closeModal}
      >

        {/* PROFILE FORM */}
        {activeModal === "profile" && (
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-3">
            <input {...profileForm.register("name")} className="border p-2 rounded" />
            <input {...profileForm.register("email")} className="border p-2 rounded" />
            <input {...profileForm.register("mobile")} className="border p-2 rounded" />
            <SubmitButtons onCancel={closeModal} />
          </form>
        )}

        {/* BUSINESS FORM */}
        {activeModal === "business" && (
          <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="flex flex-col gap-3">
            <input {...businessForm.register("shopName")} className="border p-2 rounded" />
            <input {...businessForm.register("gstNumber")} className="border p-2 rounded" />
            <SubmitButtons onCancel={closeModal} />
          </form>
        )}

        {/* ADDRESS FORM */}
        {activeModal === "address" && (
          <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="flex flex-col gap-3">
            <input {...addressForm.register("area")} className="border p-2 rounded" />
            <input {...addressForm.register("city")} className="border p-2 rounded" />
            <input {...addressForm.register("state")} className="border p-2 rounded" />
            <input {...addressForm.register("pincode")} className="border p-2 rounded" />
            <SubmitButtons onCancel={closeModal} />
          </form>
        )}

        {/* BANK FORM */}
        {activeModal === "bank" && (
          <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="flex flex-col gap-3">
            <input {...bankForm.register("bankName")} className="border p-2 rounded" />
            <input {...bankForm.register("accountNumber")} className="border p-2 rounded" />
            <input {...bankForm.register("ifsc")} className="border p-2 rounded" />
            <SubmitButtons onCancel={closeModal} />
          </form>
        )}

      </ReusableModal>

    </div>
  );
}

/* ================= SMALL REUSABLE UI COMPONENTS ================= */

const Section = ({ title, onEdit, children }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex justify-between mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <button onClick={onEdit} className="text-blue-600">Edit</button>
    </div>
    <div className="grid md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const SubmitButtons = ({ onCancel }) => (
  <div className="flex justify-end gap-2 mt-4">
    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
      Cancel
    </button>
    <button className="px-4 py-2 bg-blue-600 text-white rounded">
      Save
    </button>
  </div>
);