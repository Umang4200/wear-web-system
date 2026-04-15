import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";
import Button from "../UI/Button";

export default function AdminProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });
  const [isSaving, setIsSaving] = useState(false);

  const getAdminDetail = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/profile");
      const uData = res.data.data.userObj;
      setUserData(uData);
      setFormData({
        name: uData.name || "",
        email: uData.email || "",
        mobile: uData.mobile || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminDetail();
  }, []);

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      // Save changes
      try {
        setIsSaving(true);
        const res = await axiosInstance.put("/user/profile", formData);
        if (res.data.success) {
          toast.success("Profile updated successfully!");
          setUserData(res.data.userObj);
          setIsEditing(false);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update profile");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Admin Account</h2>
        <p className="text-gray-600">
          Manage your personal information and login details.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Card Header */}
        <div className="bg-indigo-50 px-8 py-10 border-b border-gray-100 flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
            {userData?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{userData?.name || "Admin User"}</h3>
            <p className="text-indigo-600 font-medium">System Administrator</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter full name"
                />
              ) : (
                <p className="text-lg text-gray-800 font-medium">{userData?.name || "—"}</p>
              )}
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Email ID
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled // Email usually shouldn't be changed easily for admins
                  className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg px-4 py-2.5 cursor-not-allowed outline-none"
                  placeholder="Enter email address"
                />
              ) : (
                <p className="text-lg text-gray-800 font-medium">{userData?.email || "—"}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter mobile number"
                />
              ) : (
                <p className="text-lg text-gray-800 font-medium">{userData?.mobile || "- not added -"}</p>
              )}
            </div>
            
            {/* Role - Read Only */}
            <div>
              <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                User Role
              </label>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-100 text-indigo-700">
                {userData?.role || "admin"}
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            {isEditing && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    mobile: userData.mobile || "",
                  });
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleEditToggle}
              disabled={isSaving}
              className="px-10"
            >
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
