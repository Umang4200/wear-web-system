import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../AxiosInstance";
import { FaStar, FaRegStar, FaCheckCircle } from "react-icons/fa";
import { MdCameraAlt } from "react-icons/md";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState({}); // {productId: true/false}

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/order/${id}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order && order.orderStatus === "Delivered") {
      order.items.forEach(async (item) => {
        try {
          const res = await axiosInstance.get(`/review/check-eligibility/${item.productId._id}`);
          setReviewedProducts(prev => ({
            ...prev,
            [item.productId._id]: !res.data.canReview && res.data.message === "You have already reviewed this product"
          }));
        } catch (error) {
          console.error("Error checking eligibility", error);
        }
      });
    }
  }, [order]);

  const handleReviewSubmit = async (e, productId) => {
    e.preventDefault();
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please add a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", reviewRating);
      formData.append("comment", reviewComment);
      formData.append("title", reviewTitle);

      reviewImages.forEach((img) => {
        formData.append("images", img);
      });

      const response = await axiosInstance.post("/review/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message);
      setReviewComment("");
      setReviewTitle("");
      setReviewRating(5);
      setReviewImages([]);
      setReviewingProductId(null);
      setReviewedProducts(prev => ({ ...prev, [productId]: true }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <p>Order not found.</p>
      </div>
    );
  }

  const timeline = [
    { title: "Placed", date: new Date(order.createdAt).toLocaleDateString(), done: true },
    { title: "Pending", date: "", done: ["Pending", "Shipped", "Delivered"].includes(order.orderStatus) },
    { title: "Shipped", date: "", done: ["Shipped", "Delivered"].includes(order.orderStatus) },
    { title: "Delivered", date: "", done: order.orderStatus === "Delivered" },
  ];

  if (order.orderStatus === "Cancelled") {
    timeline.push({ title: "Cancelled", date: "", done: true })
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      {/* Order Info */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Total:</strong> ₹{order.totalAmount}
        </p>
        <p
          className={`font-semibold mt-2 ${order.orderStatus === "Delivered" ? "text-green-600" : "text-blue-600"
            }`}
        >
          {order.orderStatus}
        </p>
      </div>

      {/* Products */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-3">Products</h3>

        {order.items.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center gap-4 mb-3 p-2 hover:bg-gray-50 transition-colors rounded-lg">
              <img
                src={item.productId?.imagePaths?.[0] || "https://via.placeholder.com/100"}
                className="w-20 h-20 rounded-lg object-cover"
                alt=""
              />
              <div>
                <p>{item.productId?.title || "Unknown Product"}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} × {item.quantity}
                </p>
                <p className="text-xs text-gray-400">
                  Color: {item.productId?.colors?.[0] || 'N/A'}, Size: {item.productId?.size?.[0] || 'N/A'}
                </p>
              </div>

              {/* Review Button/Form */}
              <div className="ml-auto">
                {order.orderStatus === "Delivered" && !reviewedProducts[item.productId?._id] && (
                  <button
                    onClick={() => setReviewingProductId(reviewingProductId === item.productId?._id ? null : item.productId?._id)}
                    className="text-xs font-bold uppercase tracking-widest text-primary border border-primary px-3 py-1.5 hover:bg-primary hover:text-white transition-all"
                  >
                    {reviewingProductId === item.productId?._id ? "Close" : "Rate & Review"}
                  </button>
                )}
                {reviewedProducts[item.productId?._id] && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                    <FaCheckCircle /> Reviewed
                  </div>
                )}
              </div>
            </div>

            {/* Inline Review Form */}
            {reviewingProductId === item.productId?._id && (
              <div className="mb-6 mx-4 p-6 bg-gray-50 border border-gray-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Write a Review for {item.productId?.title}</h4>
                <form onSubmit={(e) => handleReviewSubmit(e, item.productId?._id)} className="space-y-4">
                  <div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-xl focus:outline-none transition-transform hover:scale-110"
                        >
                          {star <= reviewRating ? (
                            <FaStar className="text-yellow-500" />
                          ) : (
                            <FaRegStar className="text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Title: e.g. Classy Product / Worth the money"
                    className="w-full border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors bg-white rounded uppercase tracking-wider"
                    required
                  />

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full border border-gray-200 p-3 text-sm focus:border-black outline-none transition-colors min-h-[80px] bg-white rounded"
                    
                  ></textarea>

                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer flex flex-col items-center justify-center w-12 h-12 border border-dashed border-gray-300 hover:border-black transition-colors rounded text-gray-400 hover:text-black">
                      <MdCameraAlt className="text-lg" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setReviewImages(Array.from(e.target.files))}
                      />
                    </label>
                    <div className="flex gap-2">
                      {reviewImages.map((img, i) => (
                        <div key={i} className="w-12 h-12 border border-gray-200 rounded overflow-hidden relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto bg-black text-white px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:bg-gray-400 rounded"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/*  Timeline */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Order Timeline</h3>

        <div className="relative border-l-2 border-gray-300 ml-4">
          {timeline.map((step, index) => (
            <div key={index} className="mb-6 ml-4">
              {/* Dot */}
              <div
                className={`absolute -left-2 w-4 h-4 rounded-full ${step.done ? (step.title === "Cancelled" ? "bg-red-500" : "bg-green-500") : "bg-gray-300"
                  }`}
              ></div>

              {/* Content */}
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-gray-500">{step.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
