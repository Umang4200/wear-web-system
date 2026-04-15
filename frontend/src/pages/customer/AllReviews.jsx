import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";
import { FaStar, FaCheckCircle, FaThumbsUp, FaThumbsDown, FaChevronLeft, FaTag } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";
import { toast } from "react-toastify";

const AllReviews = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductAndReviews();
  }, [productId]);

  const fetchProductAndReviews = async () => {
    setLoading(true);
    try {
      const [prodRes, revRes] = await Promise.all([
        axiosInstance.get(`/product/product-by-id/${productId}`),
        axiosInstance.get(`/review/product-reviews/${productId}`)
      ]);
      setProduct(prodRes.data.data);
      setReviews(revRes.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reviewId, voteType) => {
    try {
      const res = await axiosInstance.post(`/review/vote/${reviewId}`, { voteType });
      if (res.data.success) {
        setReviews(prev => prev.map(r => 
          r._id === reviewId 
            ? { ...r, helpfulUsers: new Array(res.data.helpfulCount), unhelpfulUsers: new Array(res.data.unhelpfulCount) } 
            : r
        ));
        toast.success("Vote recorded");
        // Re-fetch to get actual counts correctly if needed, or just update local state
        fetchProductAndReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to vote");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-primary font-bold">Loading Flipkart-style Reviews...</div>;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaChevronLeft className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate">Ratings & Reviews - {product?.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN - SUMMARY */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Product Ratings</h2>
            
            <div className="flex items-start gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-4xl font-bold text-gray-900">
                  {averageRating} <FaStar className="text-3xl text-gray-900" />
                </div>
                <p className="text-sm text-gray-500 font-medium mt-2">{reviews.length} Ratings &</p>
                <p className="text-sm text-gray-500 font-medium">{reviews.length} Reviews</p>
              </div>

              <div className="flex-grow space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter(r => r.rating === star).length;
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-[11px] font-bold w-4 flex items-center gap-0.5">{star} <FaStar className="text-[8px]" /></span>
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

            <div className="pt-6 border-t border-gray-100 flex justify-around">
               <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaCheckCircle className="text-blue-600" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">100% Original</p>
               </div>
               <div className="text-center">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MdVerifiedUser className="text-green-600" />
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Real Users</p>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - REVIEW LIST */}
        <div className="lg:w-2/3 space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <div key={i} className="bg-white p-6 rounded shadow-sm border border-gray-100 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold text-white ${review.rating >= 4 ? 'bg-green-600' : review.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {review.rating} <FaStar className="text-[9px]" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm tracking-tight">{review.title || "Classy Product"}</h4>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {review.comment}
                </p>

                {/* Review Images Grid */}
                {review.images?.length > 0 && (
                  <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
                    {review.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        className="w-24 h-32 object-cover rounded border border-gray-200" 
                        alt="review" 
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-y-2 text-[11px] font-medium text-gray-500 border-t border-gray-50 pt-4 mt-4">
                  <div className="flex items-center gap-2 mr-6 text-gray-900 font-bold shrink-0">
                    {review.userId?.name}
                    <FaCheckCircle className="text-green-600 text-[10px]" />
                    <span className="text-green-600 font-bold">Verified Purchase</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mr-6 shrink-0">
                    <FaTag className="text-[10px]" />
                    <span className="text-gray-400">Color: {product?.colors?.[0] || "N/A"}</span>
                  </div>

                  <div className="ml-auto flex items-center gap-6">
                    <span className="text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    
              
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-20 text-center rounded border border-dashed border-gray-200">
               <p className="text-gray-400 font-medium italic underline decoration-blue-100 underline-offset-8">No reviews found for this product yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllReviews;
