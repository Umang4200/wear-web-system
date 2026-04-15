import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";
import { IoIosStar, IoIosStarOutline, IoMdStarHalf } from "react-icons/io";
import { FaCheckCircle, FaTruck, FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdPayment, MdOutlineLocalOffer, MdCameraAlt, MdExpandMore } from "react-icons/md";
import { toast } from "react-toastify";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [token, setToken] = useState();
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const scrollRef = React.useRef(null);
  const navigate = useNavigate();

  const handleQty = (type) => {
    if (type === "inc") {
      setQty((prev) => prev + 1);
    } else {
      if (qty > 1) setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    //  Size validation
    if (product.size?.length > 0 && !selectedSize) {
      setError("Please select a size");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/cart/add", {
        productId: productId,
        quantity: qty,
        size: selectedSize,
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const getProductDetailById = async () => {
    try {
      const response = await axiosInstance.get(
        `/product/product-by-id/${productId}`
      );
      setProduct(response.data.data);
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  useEffect(() => {
    getProductDetailById();
    fetchReviews();
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/review/product-reviews/${productId}`);
      setReviews(response.data.data);
    } catch (error) {
      console.log("Error fetching reviews", error);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;
  
  const scroll = (direction) => {
    if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
        scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    if (product?.imagePaths?.length > 0) {
      setSelectedImage(product.imagePaths[0]);
    }
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT - IMAGES GALLERY */}
        <div className="flex flex-col-reverse md:flex-row gap-5">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar">
            {product?.imagePaths?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-24 object-cover cursor-pointer hover:border-gray-800 transition-all ${
                  selectedImage === img ? "border-2 border-black" : "border border-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full flex-grow bg-gray-50 flex items-center justify-center relative overflow-hidden">
            <img
              src={selectedImage}
              alt={product?.title || "Product Image"}
              className="w-full h-full object-cover max-h-[750px]"
            />
          </div>
        </div>

        {/* RIGHT - DETAILS */}
        <div className="flex flex-col">
          {/* Breadcrumbs or Brand */}
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-3">
            {product?.brand || "WEAR WEB COLLECTION"}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {product?.title}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-black">₹{product?.price}</span>
            <span className="text-lg text-gray-400 line-through">₹{(product?.price || 0) + 300}</span>
            <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
              30% OFF
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product?.description}
          </p>

          <div className="h-px bg-gray-200 w-full mb-8"></div>

          {/* SIZES */}
          {product?.size?.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 uppercase text-sm tracking-wide">Select Size</h3>
                <span className="text-xs text-gray-500 underline cursor-pointer hover:text-black">Size Guide</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {product?.size.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedSize(s);
                      setError("");
                    }}
                    className={`w-14 h-14 flex items-center justify-center border font-medium transition-all ${
                      selectedSize === s 
                        ? "border-black bg-primary text-white" 
                        : "border-gray-200 text-gray-700 bg-white hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && (
                <p className="text-red-500 text-sm font-medium mt-3">{error}</p>
              )}
            </div>
          )}

          {/* STOCK STATUS */}
          {product?.quantity <= 0 && (
             <p className="text-sm font-semibold text-red-500 mb-6 uppercase tracking-wide">
               Out of stock
             </p>
          )}

          {/* ADD TO CART & WISHLIST */}
          <div className="flex gap-4 mb-10 w-full mt-auto">
            <button
              onClick={() => (token ? handleAddToCart() : navigate("/login"))}
              className="flex-grow bg-primary text-white py-4 text-sm font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={product?.quantity <= 0}
            >
              Add to Cart
            </button>
          </div>

          <div className="h-px bg-gray-200 w-full mb-8"></div>

          {/* PRODUCT PERKS */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-gray-800">
              <FaCheckCircle className="text-xl mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Authentic & Quality Assured</p>
                <p className="text-xs text-gray-500 mt-1">100% Genuine products</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-gray-800">
              <FaTruck className="text-xl mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-500 mt-1">On all orders</p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-gray-800">
              <MdPayment className="text-xl mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Pay on Delivery Available</p>
                <p className="text-xs text-gray-500 mt-1">Cash on delivery</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    {/* REVIEWS SECTION */}
    <div className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100 mt-16">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left - Review Summary */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Ratings & Reviews</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-bold">{averageRating}</span>
                  <FaStar className="text-xl" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{reviews.length} Ratings &</p>
                <p className="text-sm font-bold text-gray-900">{reviews.length} Reviews</p>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="space-y-3 mt-8">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-semibold w-8 flex items-center gap-1">{star} <FaStar className="text-[10px]" /></span>
                    <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${star >= 4 ? 'bg-green-600' : star >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-[11px] text-gray-400 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right - Reviews List / Slider */}
        <div className="lg:w-2/3 relative group">
          {reviews.length > 0 ? (
            <>
              {/* SLIDER VIEW */}
              {!showAllReviews ? (
                <div className="relative">
                   {/* Scroll Buttons */}
                   {reviews.length > 2 && (
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 -right-4 flex justify-between pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-all pointer-events-auto border border-gray-100"
                      >
                        <FaChevronLeft />
                      </button>
                      <button 
                         onClick={() => scroll('right')}
                         className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-all pointer-events-auto border border-gray-100"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                   )}

                  <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-hidden snap-x snap-mandatory scroll-smooth p-2 no-scrollbar"
                  >
                    {reviews.map((review, i) => (
                      <div 
                        key={i} 
                        className="min-w-full md:min-w-[calc(50%-8px)] snap-start bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${review.rating >= 4 ? 'bg-green-600' : review.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                            {review.rating} <FaStar className="text-[8px]" />
                          </div>
                          <span className="font-bold text-gray-900 text-sm truncate">{review.userId?.name}</span>
                          <span className="ml-auto text-[10px] text-gray-400">
                             {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                          {review.comment}
                        </p>

                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                           <FaCheckCircle className="text-green-600" /> Certified Buyer
                        </div>
                        
                        {review.images?.length > 0 && (
                          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                            {review.images.slice(0, 3).map((img, idx) => (
                              <img key={idx} src={img} alt="review" className="w-12 h-16 object-cover rounded border border-gray-100" />
                            ))}
                            {review.images.length > 3 && (
                               <div className="w-12 h-16 bg-gray-100 flex items-center justify-center rounded text-[10px] font-bold text-gray-500">+{review.images.length - 3}</div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button 
                      onClick={() => navigate(`/product-reviews/${productId}`)}
                      className="group flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase hover:underline"
                    >
                      Show All Reviews ({reviews.length})
                      <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                /* FULL LIST VIEW (Legacy, we keep it as a fallback but we prefer navigation) */
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">All Customer Reviews</h3>
                      <button 
                        onClick={() => setShowAllReviews(false)}
                        className="text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                      >
                        Show Slider
                      </button>
                   </div>
                   {reviews.map((review, i) => (
                    <div key={i} className="pb-12 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white ${review.rating >= 4 ? 'bg-green-600' : review.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                            {review.rating} <FaStar className="text-[10px]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-tight">{review.userId?.name}</h4>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          <FaCheckCircle /> Verified Buyer
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>
                      {review.images?.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                          {review.images.map((img, idx) => (
                            <img key={idx} src={img} alt="review" className="w-24 h-32 object-cover rounded shadow-sm hover:scale-105 transition-transform" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
              <p className="text-gray-400 font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default ProductDetail;
