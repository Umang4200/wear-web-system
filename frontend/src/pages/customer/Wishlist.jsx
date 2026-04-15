import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance.js";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const [wishData, setWishData] = useState([]);
  const navigate = useNavigate();

  const getWishlist = async () => {
    try {
      const response = await axiosInstance.get("/wishlist/");
      setWishData(response.data.data?.products || []);
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  const removeItemFromWishlist = async (productId, e) => {
    e.stopPropagation();
    try {
      const res = await axiosInstance.post("/wishlist/remove", {
        productId,
      });

      setWishData((prev) => prev.filter((item) => item._id !== productId));
      toast.success(res.data.message);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  //  MOVE TO CART FUNCTION
  const moveToCart = async (item, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.post("/cart/add", {
        productId: item._id,
        quantity: 1,
        size: item.size?.length > 0 ? item.size[0] : "", 
      });

      await axiosInstance.post("/wishlist/remove", {
        productId: item._id,
      });

      setWishData((prev) => prev.filter((p) => p._id !== item._id));
      toast.success("Moved to cart");
      navigate("/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move item");
    }
  };

  return (
    <div className="bg-white w-full mx-auto px-4 md:px-10 lg:px-16 py-12 md:py-20 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-center border-b border-gray-100 pb-6">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black uppercase">
          My Wishlist
        </h2>
        <span className="text-gray-500 font-medium text-sm mt-2 md:mt-0 uppercase tracking-widest">
            {wishData.length} Items Saved
        </span>
      </div>

      {wishData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl">
          <div className="mb-6 opacity-30">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Wishlist is empty</h2>
          <p className="text-gray-500 mt-3 mb-8 max-w-xs mx-auto">
            Save items you love and keep track of your favorites.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary text-white px-10 py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            Start exploring
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {wishData?.map((item) => (
            <div key={item._id} className="group cursor-pointer flex flex-col relative" onClick={() => navigate(`/productdetail/${item._id}`)}>
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
                <img
                  src={item.imagePaths[0]}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={item.title}
                />

                {/*  Remove Button */}
                <button
                  onClick={(e) => removeItemFromWishlist(item._id, e)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full opacity-100 hover:bg-white shadow-sm transition-all"
                >
                  <RxCross2 className="text-gray-900 text-lg" />
                </button>
              </div>

              {/* INFO */}
              <div className="mt-5 text-center flex-grow">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-1">
                  {item.brand || "Wear Web"}
                </h3>
                <p className="text-sm text-gray-500 truncate px-2 mb-2 w-full">
                  {item.title}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <span className="text-base font-semibold text-gray-900">₹{item.price}</span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">30% OFF</span>
                </div>
              </div>

              {/* Move to Cart button */}
              <div className="mt-4">
                <button
                  onClick={(e) => moveToCart(item, e)}
                  className="w-full bg-primary text-white py-3 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:bg-gray-300"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
