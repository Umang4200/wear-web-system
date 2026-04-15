import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import Table from "../UI/Table";
import Button from "../UI/Button";
import ConfirmDialog from "../UI/ConfirmDialog";
import { MdCheck, MdClose, MdInfoOutline } from "react-icons/md";
import Modal from "../UI/Modal";
import { toast } from "react-toastify";

function SellersManagement() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ id: "", action: "", name: "" });

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/sellers");
      if (response.data.success) {
        setSellers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch sellers", error);
      toast.error("Failed to fetch seller list");
    } finally {
      setLoading(false);
    }
  };

  const handleActionRequest = (seller, action) => {
    setConfirmConfig({
      id: seller._id,
      action: action,
      name: seller.shopName
    });
    setIsConfirmOpen(true);
  };

  const executeAction = async () => {
    const { id, action } = confirmConfig;
    try {
      if (action === "approve") {
        await axiosInstance.put(`/admin/sellers/approve/${id}`);
        toast.success("Seller account approved successfully!");
      } else if (action === "reject") {
        await axiosInstance.put(`/admin/sellers/reject/${id}`);
        toast.warning("Seller account has been rejected.");
      }
      setIsConfirmOpen(false);
      fetchSellers();
    } catch (error) {
      console.error(`Action ${action} failed`, error);
      toast.error(`Action failed: ${error.response?.data?.message || "Something went wrong"}`);
    }
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setIsDetailsOpen(true);
  }

  const columns = [
    { header: "Shop Name", accessor: "shopName" },
    { header: "Owner", render: (row) => row.userId?.name || "N/A" },
    { header: "Email", render: (row) => row.businessEmail },
    { header: "Status",
      render: (row) => {
        const status = row.status || "pending";
        
        let colorClasses = "bg-yellow-100 text-yellow-700";
        let label = "Pending Approval";

        if (status === "approved") {
          colorClasses = "bg-green-100 text-green-700";
          label = "Approved";
        } else if (status === "rejected") {
          colorClasses = "bg-red-100 text-red-700";
          label = "Rejected";
        }

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorClasses}`}>
            {label}
          </span>
        );
      } 
    },
    { header: "Actions", 
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "pending" && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleActionRequest(row, "approve")}
                title="Approve Seller"
                className="hover:bg-green-50 border-green-100"
              >
                <MdCheck className="text-green-600 text-lg" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleActionRequest(row, "reject")}
                title="Reject Seller"
                className="hover:bg-red-50 border-red-100"
              >
                <MdClose className="text-red-500 text-lg" />
              </Button>
            </>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewDetails(row)}
            title="View Full Details"
            className="hover:bg-blue-50 border-blue-100"
          >
            <MdInfoOutline className="text-blue-500 text-lg" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Seller Management</h2>
        <p className="text-gray-500 mt-2 font-medium">Review partnership applications and manage active sellers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide">Syncing Seller Records...</p>
          </div>
        ) : (
          <Table columns={columns} data={sellers} />
        )}
      </div>

      {/* Action Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeAction}
        title={`${confirmConfig.action.charAt(0).toUpperCase() + confirmConfig.action.slice(1)} Seller`}
        message={`Are you sure you want to ${confirmConfig.action} "${confirmConfig.name}"? This decision will affect their ability to sell on the platform.`}
        variant={confirmConfig.action === "reject" ? "danger" : "primary"}
      />

      {/* Seller Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Seller Profile Overview">
        {selectedSeller && (
          <div className="space-y-6 py-2">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shop Identity</p>
                <p className="text-lg font-bold text-gray-900">{selectedSeller.shopName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Owner Legal Name</p>
                <p className="text-lg font-semibold text-gray-800">{selectedSeller.userId?.name || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Business Communication</p>
                <p className="text-gray-800 font-medium">{selectedSeller.businessEmail}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tax Identification (GST)</p>
                <p className="text-gray-800 font-mono font-bold tracking-tighter">{selectedSeller.gstNumber}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedSeller.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {selectedSeller.isVerified ? "Approved" : "Pending Verification"}
                </span>
              </div>
            </div>

            {selectedSeller.bankDetails && (
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Banking & Settlement Details
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Account Holder</p>
                      <p className="font-semibold text-gray-800">{selectedSeller.bankDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Account Number</p>
                      <p className="font-mono text-gray-800">{selectedSeller.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">IFSC Code</p>
                      <p className="font-mono text-gray-800">{selectedSeller.bankDetails.ifscCode}</p>
                    </div>
                  </div>
               </div>
            )}
            
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button onClick={() => setIsDetailsOpen(false)}>Close Overview</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

export default SellersManagement;

