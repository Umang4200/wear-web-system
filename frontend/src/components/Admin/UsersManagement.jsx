import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import Table from "../UI/Table";
import Button from "../UI/Button";
import ConfirmDialog from "../UI/ConfirmDialog";
import Modal from "../UI/Modal";
import { MdDelete } from "react-icons/md";

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (user, action) => {
    const msg = `Are you sure you want to permanently delete user ${user.name}?`;
      
    if (!window.confirm(msg)) return;

    try {
      await axiosInstance.delete(`/admin/users/${user._id}`);
      fetchUsers();
      alert(`User deleted successfully`);
    } catch (error) {
      console.error("Action failed", error);
      alert(`Action failed: ${error.response?.data?.message || "Something went wrong"}`);
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role", 
      render: (row) => (
        <span className="capitalize px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
          {row.role}
        </span>
      ) 
    },
    { header: "Status", accessor: "status",
      render: (row) => (
        <span className="capitalize px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
          Active
        </span>
      ) 
    },
    { header: "Actions", 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleActionClick(row, "delete")}
          >
            <MdDelete className="text-red-500" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500 mt-1">Manage all customers and sellers here.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading users...</div>
      ) : (
        <Table columns={columns} data={users} />
      )}
    </div>
  );
}

export default UsersManagement;
