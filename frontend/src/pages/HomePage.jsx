import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../AxiosInstance";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const heroImages = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572611932849-7f0f116fb2f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1655252205431-5d0ef316837b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMxfHx8ZW58MHx8fHx8",
];

function HomePage() {
  const [current, setCurrent] = useState(0);
  const [productData, setProductData] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const navigate = useNavigate();

  // Auto Slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/product/products?limit=12`);
      setProductData(response.data.data);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed to fetch products");
    }
  };

  const getWishlist = async () => {
    try {
      const response = await axiosInstance.get("/wishlist/");
      const products = response.data.data.products;
      const productIds = products.map((item) => item._id);
      setWishlist(productIds);
    } catch (error) {
      // It's okay if it fails for unauthenticated users
    }
  };

  useEffect(() => {
    getProducts();
    if (localStorage.getItem("token")) {
      getWishlist();
    }
  }, []);

  const toggleWishlist = async (productId, e) => {
    e.stopPropagation(); // prevent card click
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (wishlist.includes(productId)) {
        await axiosInstance.post("/wishlist/remove", { productId });
        setWishlist((prev) => prev.filter((item) => item !== productId));
        toast.info("Removed from wishlist");
      } else {
        await axiosInstance.post("/wishlist/add-to-wishlist", { productId });
        setWishlist((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="w-full bg-white relative">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[90vh] md:h-screen w-full overflow-hidden">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={img} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/30"></div>
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 text-white">
          <p className="text-sm tracking-[0.3em] uppercase mb-4 font-medium opacity-90">
            Spring / Summer 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-tight max-w-4xl">
            ELEVATE YOUR <br className="hidden md:block" /> EVERYDAY STYLE
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() =>
                document
                  .getElementById("new-arrivals")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:scale-105 transition-transform"
            >
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroImages.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                current === idx ? "w-8 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ================= PRODUCTS CATEGORY PREVIEW (Optional Enhancement) ================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/search?query=Women")}
          className="relative h-[60vh] group overflow-hidden rounded-2xl cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt="Women"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <h3 className="text-3xl font-bold mb-2 tracking-tight">WOMEN</h3>
            <p className="text-sm font-medium underline underline-offset-4 uppercase tracking-widest text-white/90">
              Discover
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate("/search?query=Men")}
          className="relative h-[60vh] group overflow-hidden rounded-2xl cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1000&auto=format&fit=crop"
            className="w-full h-full object-cover top-1/4 group-hover:scale-105 transition-transform duration-700"
            alt="Men"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <h3 className="text-3xl font-bold mb-2 tracking-tight">MEN</h3>
            <p className="text-sm font-medium underline underline-offset-4 uppercase tracking-widest text-white/90">
              Discover
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate("/search?query=Kids")}
          className="relative h-[60vh] group overflow-hidden rounded-2xl cursor-pointer"
        >
          <img
            src="https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=1000&auto=format&fit=crop"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt="Kids"
          />
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors"></div>
          <div className="absolute bottom-10 left-10 text-white">
            <h3 className="text-3xl font-bold mb-2 tracking-tight">KIDS</h3>
            <p className="text-sm font-medium underline underline-offset-4 uppercase tracking-widest text-white/90">
              Discover
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS SECTION ================= */}
      <section id="new-arrivals" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            NEW ARRIVALS
          </h2>
          <div className="h-1 w-16 bg-primary"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productData?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/productdetail/${item._id}`)}
              className="group cursor-pointer flex flex-col relative"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
                <img
                  src={item.imagePaths[0]}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Wishlist Icon */}
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
                  <span className="text-base font-semibold text-gray-900">
                    ₹{item.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{item.price + 300}
                  </span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    30% OFF
                  </span>
                </div>
              </div>

              {/* Add to Cart Overlay Button */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-full bg-primary text-white py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                  VIEW PRODUCT
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
            <button 
              onClick={() => navigate("/search?query=")}
              className="border border-black text-black px-10 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-primary hover:text-white transition-colors"
            >
              VIEW ALL PRODUCTS
            </button>
        </div> */}
      </section>

      {/* ================= BRAND HIGHLIGHT ================= */}
      <section className="bg-gray-100 py-24 px-6 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">
            CRAFTED FOR YOU.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto text-center font-light">
            We merge minimalist design with high-quality fabrics perfectly
            curated to fit into your lifestyle. Discover pieces that transcend
            seasons.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
