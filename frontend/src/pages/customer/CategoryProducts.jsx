import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort] = useState("");

  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  //  FETCH PRODUCTS
  const getProducts = async () => {
    try {
      setLoading(true);

      const url = `/product/category/${categoryId}?page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}${
        sort ? `&sort=${sort}` : ""
      }${selectedColors.length ? `&colors=${selectedColors.join(",")}` : ""}${
        selectedBrands.length ? `&brands=${selectedBrands.join(",")}` : ""
      }`;

      const res = await axiosInstance.get(url);

      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //  FILTER HANDLERS
  const handleColorChange = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  //  WISHLIST
  const getWishlist = async () => {
    const res = await axiosInstance.get("/wishlist/");
    const ids = res.data.data?.products?.map((i) => i._id) || [];
    setWishlist(ids);
  };

  const toggleWishlist = async (id, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (wishlist.includes(id)) {
      await axiosInstance.post("/wishlist/remove", { productId: id });
      setWishlist((prev) => prev.filter((i) => i !== id));
    } else {
      await axiosInstance.post("/wishlist/add-to-wishlist", {
        productId: id,
      });
      setWishlist((prev) => [...prev, id]);
    }
  };

  //  RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {
    setPage(1);
  }, [selectedColors, selectedBrands, sort, minPrice, maxPrice]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getWishlist();
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [
    categoryId,
    page,
    minPrice,
    maxPrice,
    sort,
    selectedColors,
    selectedBrands,
  ]);

  return (
    <div className="bg-white w-full mx-auto px-4 md:px-10 lg:px-16 py-10 md:py-16">
      
      {/*  TITLE & FILTER HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-200 pb-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 uppercase">
            Collection
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Showing {products.length} Products
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-gray-500 mr-3 font-medium uppercase tracking-wide">Sort By</span>
            <select
                onChange={(e) => setSort(e.target.value)}
                className="border-none bg-gray-50 text-sm px-4 py-2.5 rounded-xl font-medium text-gray-800 focus:ring-0 outline-none cursor-pointer"
            >
                <option value="">Recommended</option>
                <option value="low">Price: Low - High</option>
                <option value="high">Price: High - Low</option>
                <option value="new">Newest Arrivals</option>
            </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/*  SIDEBAR FILTERS */}
        <div className="w-full lg:w-[260px] shrink-0 space-y-10">
          
          {/* BRAND */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-black uppercase tracking-widest border-b border-gray-100 pb-2">Brands</h4>
            <div className="space-y-3 mt-4 text-sm max-h-40 overflow-y-auto no-scrollbar">
              {["U.S. POLO", "HRX", "Tommy Hilfiger", "Levis", "Puma", "Zara", "H&M"].map(
                (brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span className="text-gray-600 group-hover:text-black transition-colors">{brand}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* PRICE */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-black uppercase tracking-widest border-b border-gray-100 pb-2">Price</h4>
            <div className="mt-4">
                <input
                    type="range"
                    min="100"
                    max="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between items-center text-sm mt-3 text-gray-600 font-medium">
                    <span>₹{minPrice}</span>
                    <span>₹{maxPrice}+</span>
                </div>
            </div>
          </div>

          {/* COLOR */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-black uppercase tracking-widest border-b border-gray-100 pb-2">Colors</h4>

            <div className="mt-4 space-y-3">
                {[
                { name: "Black", code: "#000" },
                { name: "White", code: "#fff" },
                { name: "Blue", code: "#3b82f6" },
                { name: "Red", code: "#ef4444" },
                { name: "Navy", code: "#000042" },
                ].map((color) => (
                <label key={color.name} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color.name)}
                      onChange={() => handleColorChange(color.name)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    />
                    <span
                        className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color.code }}
                    ></span>
                    <span className="text-gray-600 text-sm group-hover:text-black transition-colors">{color.name}</span>
                </label>
                ))}
            </div>
          </div>
        </div>

        {/*  PRODUCTS LIST */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center bg-gray-50 rounded-2xl">
              <div className="bg-white p-5 rounded-full shadow-sm mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">No matches found</h2>
              <p className="text-gray-500 mt-2 max-w-sm">Try modifying your filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedColors([]);
                  setMinPrice(100);
                  setMaxPrice(10000);
                  setSort("");
                  setPage(1);
                }}
                className="mt-6 bg-primary text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {products.map((item) => (
                <div key={item._id} className="group cursor-pointer flex flex-col relative" onClick={() => navigate(`/productdetail/${item._id}`)}>
                  {/* IMAGE */}
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
                    <img
                      src={item.imagePaths[0]}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/*  Wishlist */}
                    <button
                      onClick={(e) => toggleWishlist(item._id, e)}
                      className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur rounded-full lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-white shadow-sm z-10"
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

                  {/* View Product Button (Always visible on mobile, hover on desktop) */}
                  <div className="mt-4 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
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

          {/*  PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        page === i + 1 ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-700"
                    }`}
                    >
                    {i + 1}
                    </button>
                ))}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryProducts;
