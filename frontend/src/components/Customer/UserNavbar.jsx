import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { HiMenu, HiX } from "react-icons/hi";
import { FaRegHeart, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

function UserNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  //  Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  //  Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //  Get User Profile
  const getCustomerDetail = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      setName(res.data.data.userObj.name);
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setName("");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      navigate(`/search?query=${searchQuery}`);
    } catch (error) {
      console.log(error);
    }
  };

  //  Check Token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      getCustomerDetail();
    } else {
      setToken(null);
      setName("");
    }
  }, []);

  //  Get Categories
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/category/categories");
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  //  Convert Flat → Tree
  const buildCategoryTree = (data) => {
    const map = {};
    const roots = [];

    data.forEach((cat) => {
      map[cat._id] = { ...cat, children: [] };
    });

    data.forEach((cat) => {
      if (cat.parentCategoryId) {
        map[cat.parentCategoryId._id]?.children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    // Sort Level 1 categories: Men, Women, Kids
    const order = ["Men", "Women", "Kids"];
    roots.sort((a, b) => {
      let indexA = order.indexOf(a.name);
      let indexB = order.indexOf(b.name);
      if (indexA === -1) indexA = 999;
      if (indexB === -1) indexB = 999;
      return indexA - indexB;
    });

    return roots;
  };

  const categoryTree = buildCategoryTree(categories);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-6 md:px-16 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100" : "bg-white"
          }`}
      >
        {/* LEFT */}
        <div className="flex items-center gap-12">
          <h1
            className="text-2xl font-bold tracking-tighter text-primary-black cursor-pointer"
            onClick={() => navigate("/")}
          >
            WEAR WEB
          </h1>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-8 text-sm text-gray-800 font-medium relative">
            {categoryTree.map((mainCat) => (
              <li key={mainCat._id} className="group relative cursor-pointer px-1 py-5 hover:text-black transition-colors">
                {mainCat.name}

                {/* UNDERLINE */}
                <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>

                {/* DROPDOWN - MEGA MENU */}
                <div className="absolute left-0 top-full mt-0 w-max min-w-[500px] bg-white shadow-xl p-8 hidden group-hover:flex gap-12 z-[999] border border-gray-100 rounded-b-2xl transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  {[...(mainCat.children || [])]
                    .sort((a, b) => {
                      const order = ["Top Wear", "Bottom Wear", "Foot Wear"];
                      return order.indexOf(a.name) - order.indexOf(b.name);
                    })
                    .map((subCat) => (
                      <div
                        key={subCat._id}
                        className="flex flex-col min-w-[150px]"
                      >
                        <h3 className="text-black font-bold mb-4 tracking-wide text-xs uppercase border-b border-gray-100 pb-2">
                          {subCat.name}
                        </h3>

                        <ul className="space-y-3 text-gray-500 text-sm">
                          {subCat.children?.map((child) => (
                            <li
                              key={child._id}
                              onClick={() =>
                                navigate(`/products/category/${child._id}`)
                              }
                              className="hover:text-black hover:translate-x-1 transition-all cursor-pointer"
                            >
                              {child.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-6 text-gray-800">
          {/*  SEARCH BAR */}
          <div className="hidden md:flex items-center bg-secondary-gray px-4 py-2.5 rounded-full w-[300px] hover:bg-gray-200 focus-within:bg-white focus-within:ring-1 focus-within:ring-black transition-all">
            <IoMdSearch className="text-gray-500 text-lg mr-2" />

            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          {token ? (
            <button
              className="w-9 h-9 flex items-center justify-center bg-primary rounded-full text-white font-medium hover:scale-105 hover:shadow-md transition-all"
              onClick={() => navigate("/profile")}
            >
              {name?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 shadow-sm transition-all"
              onClick={() => navigate("/login")}
            >
              <CgProfile className="text-lg" />
              Login
            </button>
          )}

          <div className="flex items-center gap-5">
            <FaRegHeart
              onClick={() => (token ? navigate("/wishlist") : navigate("/login"))}
              className="text-[22px] cursor-pointer hover:text-black transition-colors"
            />

            <div className="relative">
              <TiShoppingCart
                onClick={() => (token ? navigate("/cart") : navigate("/login"))}
                className="text-[24px] cursor-pointer hover:text-black transition-colors"
              />
            </div>
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-4">
          <IoMdSearch 
            className="text-2xl text-gray-600 cursor-pointer"
            onClick={() => {
              setMenuOpen(true);
              // Focus search input after a short delay to allow drawer animation
              setTimeout(() => document.getElementById('mobile-search')?.focus(), 300);
            }}
          />
          <div className="relative">
            <TiShoppingCart
              onClick={() => (token ? navigate("/cart") : navigate("/login"))}
              className="text-2xl text-gray-600 cursor-pointer"
            />
          </div>
          {menuOpen ? (
            <HiX className="text-2xl text-black cursor-pointer" onClick={() => setMenuOpen(false)} />
          ) : (
            <HiMenu className="text-2xl text-black cursor-pointer" onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}>
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Drawer Content */}
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold tracking-tight">MENU</h2>
            <HiX className="text-2xl text-black cursor-pointer" onClick={() => setMenuOpen(false)} />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* SEARCH */}
            <div className="px-6 py-6 border-b border-gray-100">
              <div className="flex items-center bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                <IoMdSearch className="text-gray-400 text-lg mr-2" />
                <input
                  id="mobile-search"
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-transparent outline-none w-full text-sm font-medium"
                />
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="px-6 py-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Categories</h3>
              <ul className="space-y-1">
                {categoryTree.map((mainCat) => (
                  <li key={mainCat._id} className="border-b border-gray-50 last:border-0">
                    <div 
                      className="flex items-center justify-between py-4 cursor-pointer"
                      onClick={() => setActiveAccordion(activeAccordion === mainCat._id ? null : mainCat._id)}
                    >
                      <span className="font-bold text-gray-900">{mainCat.name}</span>
                      {activeAccordion === mainCat._id ? <FaChevronDown className="text-xs" /> : <FaChevronRight className="text-xs text-gray-400" />}
                    </div>
                    
                    {/* Sub-categories Accordion */}
                    <div className={`overflow-hidden transition-all duration-300 ${activeAccordion === mainCat._id ? "max-h-[1000px] mb-4" : "max-h-0"}`}>
                      <div className="pl-4 space-y-6 pt-2 border-l-2 border-gray-50 ml-1">
                        {mainCat.children?.map((subCat) => (
                          <div key={subCat._id}>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">{subCat.name}</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {subCat.children?.map((child) => (
                                <button
                                  key={child._id}
                                  onClick={() => navigate(`/products/category/${child._id}`)}
                                  className="text-left text-sm text-gray-600 hover:text-black py-1"
                                >
                                  {child.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 py-8 mt-4 border-t border-gray-50 space-y-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">My Account</h3>
              {token ? (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate("/profile")}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors group"
                  >
                    <CgProfile className="text-2xl mb-2 text-gray-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold text-gray-900 underline underline-offset-4 decoration-indigo-200">Profile</span>
                  </button>
                  <button 
                    onClick={() => navigate("/wishlist")}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-pink-50 transition-colors group"
                  >
                    <FaRegHeart className="text-2xl mb-2 text-gray-400 group-hover:text-pink-500" />
                    <span className="text-xs font-bold text-gray-900 underline underline-offset-4 decoration-pink-100">Wishlist</span>
                  </button>
                </div>
              ) : (
                <button
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold tracking-widest text-xs uppercase shadow-sm hover:scale-[1.02] transition-transform"
                  onClick={() => navigate("/login")}
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
          
          {/* Footer of Drawer */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium text-center uppercase tracking-widest">
              Wear Web © 2026 Collection
            </p>
          </div>
        </div>
      </div>

      {/* SPACER (Removed because we set main pt-16 in layout, but wait - let's check if layout has pt-16) */}
    </>
  );
}

export default UserNavbar;
