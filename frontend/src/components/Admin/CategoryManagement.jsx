import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import Table from "../UI/Table";
import Button from "../UI/Button";
import ConfirmDialog from "../UI/ConfirmDialog";
import Modal from "../UI/Modal";
import { MdEdit, MdDelete, MdAdd, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const ITEMS_PER_PAGE = 10;

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [parentCategoryId, setParentCategoryId] = useState(""); // This is the actual parent to be saved
  const [selectedLevel1Id, setSelectedLevel1Id] = useState(""); // For Level 3 step 1

  // Pagination state
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [currentPage3, setCurrentPage3] = useState(1);

  const level1Categories = categories.filter((c) => c.level === 1);
  const level2Categories = categories.filter((c) => c.level === 2);
  const level3Categories = categories.filter((c) => c.level === 3);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADD ----------------
  const handleAddClick = () => {
    setModalMode("add");
    setName("");
    setLevel(1);
    setParentCategoryId("");
    setSelectedLevel1Id("");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // ---------------- EDIT ----------------
  const handleEditClick = (category) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setName(category.name);
    setLevel(category.level);
    
    if (category.level === 2) {
      setParentCategoryId(category.parentCategoryId?._id || category.parentCategoryId || "");
      setSelectedLevel1Id("");
    } else if (category.level === 3) {
      // For level 3, we need to find the grandparent (level 1)
      const parent = categories.find(c => c._id === (category.parentCategoryId?._id || category.parentCategoryId));
      if (parent) {
        setSelectedLevel1Id(parent.parentCategoryId?._id || parent.parentCategoryId || "");
        setParentCategoryId(parent._id);
      }
    } else {
      setParentCategoryId("");
      setSelectedLevel1Id("");
    }
    
    setIsModalOpen(true);
  };

  // ---------------- DELETE ----------------
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/categories/${selectedCategory._id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      level: Number(level),
      parentCategoryId: parentCategoryId || null,
    };

    try {
      if (modalMode === "add") {
        await axiosInstance.post("/admin/categories", payload);
      } else {
        await axiosInstance.put(
          `/admin/categories/${selectedCategory._id}`,
          payload
        );
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- PAGINATION HELPER ----------------
  const Pagination = ({ totalItems, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="flex items-center justify-center gap-2 mt-4 pb-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1"
        >
          <MdNavigateBefore className="text-xl" />
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={currentPage === p ? "primary" : "outline"}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 p-0 flex items-center justify-center rounded-md ${
              currentPage === p 
              ? "bg-indigo-600 text-white border-indigo-600" 
              : "text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {p}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1"
        >
          <MdNavigateNext className="text-xl" />
        </Button>
      </div>
    );
  };

  // ---------------- COLUMNS ----------------
  const commonColumns = [
    { header: "Name", accessor: "name" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditClick(row)}
          >
            <MdEdit />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteClick(row)}
          >
            <MdDelete className="text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const parentColumn = {
    header: "Parent Category",
    render: (row) => row.parentCategoryId?.name || "-",
  };

  const level2Columns = [commonColumns[0], parentColumn, commonColumns[1]];
  const level3Columns = [commonColumns[0], parentColumn, commonColumns[1]];

  // ---------------- RENDER HELPERS ----------------
  const CategorySection = ({ title, level, data, columns, currentPage, onPageChange }) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // If data is empty on current page (due to deletion), go back
    useEffect(() => {
      if (data.length > 0 && paginatedData.length === 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }, [data.length, paginatedData.length, currentPage]);

    return (
      <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm">Level {level} Categories ({data.length})</p>
        </div>
        <Table columns={columns} data={paginatedData} />
        <Pagination
          totalItems={data.length}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Category Hierarchy</h2>
          <p className="text-gray-600">
            Manage your categories across three levels of depth.
          </p>
        </div>
        <Button onClick={handleAddClick} className="flex items-center gap-2 px-6 py-3">
          <MdAdd className="text-xl" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-500 font-medium">Loading categories...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <CategorySection
            title="Primary Categories"
            level={1}
            data={level1Categories}
            columns={commonColumns}
            currentPage={currentPage1}
            onPageChange={setCurrentPage1}
          />
          <CategorySection
            title="Secondary Categories"
            level={2}
            data={level2Categories}
            columns={level2Columns}
            currentPage={currentPage2}
            onPageChange={setCurrentPage2}
          />
          <CategorySection
            title="Tertiary Categories"
            level={3}
            data={level3Categories}
            columns={level3Columns}
            currentPage={currentPage3}
            onPageChange={setCurrentPage3}
          />
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "add" ? "Add New Category" : "Edit Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Menswear, T-shirts, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hierarchy Level
            </label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(Number(e.target.value));
                setParentCategoryId("");
                setSelectedLevel1Id("");
              }}
              disabled={modalMode === "edit"}
              className={`w-full border border-gray-300 p-2.5 rounded-lg outline-none transition-all ${
                modalMode === "edit" ? "bg-gray-100 cursor-not-allowed text-gray-500" : "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              required
            >
              <option value={1}>Level 1 (Primary)</option>
              <option value={2}>Level 2 (Secondary)</option>
              <option value={3}>Level 3 (Tertiary)</option>
            </select>
          </div>

          {/* DEPENDENT DROPDOWNS */}
          {Number(level) === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Primary Category (Level 1)
              </label>
              <select
                value={parentCategoryId}
                onChange={(e) => setParentCategoryId(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              >
                <option value="">Select Primary</option>
                {level1Categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {Number(level) === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step 1: Select Primary Category (Level 1)
                </label>
                <select
                  value={selectedLevel1Id}
                  onChange={(e) => {
                    setSelectedLevel1Id(e.target.value);
                    setParentCategoryId(""); // Reset level 2 choice
                  }}
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                >
                  <option value="">Select Primary</option>
                  {level1Categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLevel1Id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Step 2: Select Secondary Parent (Level 2)
                  </label>
                  <select
                    value={parentCategoryId}
                    onChange={(e) => setParentCategoryId(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    required
                  >
                    <option value="">Select Secondary</option>
                    {level2Categories
                      .filter(c => (c.parentCategoryId?._id || c.parentCategoryId) === selectedLevel1Id)
                      .map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                  {level2Categories.filter(c => (c.parentCategoryId?._id || c.parentCategoryId) === selectedLevel1Id).length === 0 && (
                    <p className="text-xs text-red-500 mt-1">No secondary categories found under this primary category.</p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="px-6">
              {modalMode === "add" ? "Create Category" : "Update Category"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}

export default CategoryManagement;