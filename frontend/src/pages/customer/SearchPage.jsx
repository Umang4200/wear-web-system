import React, { useEffect, useState } from "react";
import axiosInstance from "../../AxiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("query");

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/product/search?query=${query}`);
      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getWishlist = async () => {
    try {
      const response = await axiosInstance.get("/wishlist/");
      const products = response.data.data?.products || [];

      // convert to array of IDs
      const productIds = products.map((item) => item._id);
      setWishlist(productIds);

    } catch (error) {
      // Ignore if not logged in or error
    }
  };

  const toggleWishlist = async (productId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (wishlist?.includes(productId)) {
        await axiosInstance.post("/wishlist/remove", { productId });
        setWishlist((prev) => prev.filter((item) => item !== productId));
      } else {
        await axiosInstance.post("/wishlist/add-to-wishlist", { productId });
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (query !== null) fetchSearchResults();
  }, [query]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getWishlist();
    }
  }, []);

  return (
    <div className="bg-white w-full mx-auto px-4 md:px-10 lg:px-16 py-10 md:py-16">
      <div className="mb-10 text-center">
        <p className="text-sm tracking-widest text-gray-400 uppercase font-medium mb-2">Search Results</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black">
          "{query}"
        </h2>
        <p className="text-gray-500 mt-4">{products.length} Items Found</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50 rounded-2xl mx-auto max-w-3xl">
          <div className="bg-white p-5 rounded-full shadow-sm mb-4">
            <span className="text-3xl">🔍</span>
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            We couldn't find matches for "{query}"
          </h2>

          <p className="text-gray-500 mt-2">
            Double check your spelling or try more general terms.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go back to Home
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((item) => (
            <div key={item._id} className="group cursor-pointer flex flex-col relative" onClick={() => navigate(`/productdetail/${item._id}`)}>
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
                <img
                  src={item.imagePaths[0]}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  alt={item.title}
                />

                {/*  Wishlist */}
                <button
                  onClick={(e) => toggleWishlist(item._id, e)}
                  className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-white shadow-sm"
                >
                  {wishlist.includes(item._id) ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-900 text-lg" />
                  )}
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
                  <span className="text-sm text-gray-400 line-through">₹{item.price + 300}</span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">30% OFF</span>
                </div>
              </div>

              {/* Add to Cart Overlay Button */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                <button
                  className="w-full bg-primary text-white py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  VIEW PRODUCT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
