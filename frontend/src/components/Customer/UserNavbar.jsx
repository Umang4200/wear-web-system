import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { HiMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

function UserNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState();
  const [name, setName] = useState("");

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

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
        <div className="md:hidden text-2xl text-black">
          {menuOpen ? (
            <HiX onClick={() => setMenuOpen(false)} />
          ) : (
            <HiMenu onClick={() => setMenuOpen(true)} />
          )}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white shadow-xl md:hidden z-40 border-t border-gray-100 flex flex-col">
          <ul className="flex flex-col gap-4 p-6 text-gray-800 font-medium">
            {categoryTree.map((cat) => (
              <li key={cat._id} className="border-b border-gray-100 pb-2">{cat.name}</li>
            ))}

            <button
              className="mt-4 bg-primary text-white w-full py-3 rounded-xl font-medium"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </ul>
        </div>
      )}

      {/* SPACER (Removed because we set main pt-16 in layout, but wait - let's check if layout has pt-16) */}
    </>
  );
}

export default UserNavbar;
