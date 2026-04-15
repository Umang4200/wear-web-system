import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const getAllProduct = async () => {
    try {
      const res = await axiosInstance.get("/product/product-by-seller");
      console.log(res.data);
      setProductData(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete-product/${selectedProductId}`
      );

      if (res.status === 200) {
        toast.success(res.data.message);

        // ✅ remove from UI instantly
        setProductData((prev) =>
          prev.filter((p) => p._id !== selectedProductId)
        );

        setShowModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {/* Header */}
      <div className="hidden md:grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_0.5fr_0.5fr] bg-primary text-white p-3 rounded-md font-semibold text-md gap-6">
        <p>Images</p>
        <p>Title</p>
        <p>Price</p>
        <p>Colors</p>
        <p>Stock</p>
        <p className="text-center">Update</p>
        <p className="text-center">Delete</p>
      </div>

      {/* Product List */}
      <div className="space-y-4 mt-4">
        {productData?.map((product) => (
          <div key={product._id} className="bg-white rounded-md shadow-sm p-4">
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_0.5fr_0.5fr] items-center gap-6">
              {/* Images */}
              <div className="grid grid-cols-2 gap-2 w-[120px]">
                {product.imagePaths.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>

              {/* Title */}
              <p className="text-md font-medium pl-6">{product.title}</p>

              {/* Price */}
              <p className="text-md">₹{product.price}</p>

              {/* Colors */}
              <div className="flex flex-wrap gap-1">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {color}
                  </span>
                ))}
              </div>

              {/* Stock */}
              <p
                className={`text-md font-medium ${
                  product.quantity > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK"}
              </p>

              {/* Edit Icon*/}
              <div className="flex justify-center">
                <Link to={`/seller/updateproduct/${product._id}`}>
                  <FaRegEdit className="text-green-600 cursor-pointer text-lg" />
                </Link>
              </div>

              {/* Delete Icon */}
              <div className="flex justify-center">
                <MdDelete
                  className="text-red-500 cursor-pointer text-lg"
                  onClick={() => {
                    setSelectedProductId(product._id);
                    setShowModal(true);
                  }}
                />
              </div>
              {showModal && (
                <div className="fixed inset-0 bg-primary/50 flex items-center justify-center z-50">
                  <div className="bg-gray-100 text-black w-[400px] rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-600">
                      <h2 className="text-lg font-semibold">Delete Product</h2>
                      <button onClick={() => setShowModal(false)}>✕</button>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <p>Are you sure you want to delete this product?</p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-4 ">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {/* Images */}
              <div className="flex gap-2 flex-wrap">
                {product.imagePaths.map((image, i) => (
                  <img
                    key={i}
                    src={image}
                    className="h-16 w-16 object-cover rounded"
                  />
                ))}
              </div>

              <p className="font-medium">{product.title}</p>
              <p className="text-md">₹{product.price}</p>

              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-200 px-2 py-1 rounded"
                  >
                    {color}
                  </span>
                ))}
              </div>

              <p
                className={`text-md font-medium ${
                  product.quantity > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK"}
              </p>

              <div className="flex gap-4">
                <FaRegEdit className="text-green-600 text-lg cursor-pointer" />
                <MdDelete className="text-red-500 text-lg cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
