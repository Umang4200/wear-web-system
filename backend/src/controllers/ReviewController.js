const mongoose = require("mongoose");
const Review = require("../models/ReviewModel");
const Order = require("../models/OrderModel");
const uploadToCloudinary = require("../utils/Cloudinary");

// ADD REVIEW WITH IMAGES
exports.addReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment, title } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Verify the user has purchased and received the product
    const order = await Order.findOne({
      userId,
      "items.productId": productId,
      orderStatus: "Delivered",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You can only review products you have purchased and received.",
      });
    }

    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await uploadToCloudinary(file.path, "wear-web-system/reviews");
        imageUrls.push(result.secure_url);
      }
    }

    //  Create review
    const review = await Review.create({
      productId,
      userId,
      rating,
      comment,
      title: title || "Verified Review",
      images: imageUrls,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    //  Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

// 2. GET PRODUCT REVIEWS
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Review Fetched successfully",
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// 3. CHECK REVIEW ELIGIBILITY
exports.checkReviewEligibility = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // Check if user has already reviewed
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: "You have already reviewed this product",
      });
    }

    // Check if user has purchased the product
    const order = await Order.findOne({
      userId,
      "items.productId": productId,
      orderStatus: "Delivered",
    });

    if (!order) {
      return res.status(200).json({
        success: true,
        canReview: false,
        message: "You can only review products you have purchased and received",
      });
    }

    res.status(200).json({
      success: true,
      canReview: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking review eligibility",
      error: error.message,
    });
  }
};

// 3. GET USER REVIEWS
// exports.getUserReviews = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const reviews = await Review.find({ userId }).populate(
//       "productId",
//       "title price images"
//     );

//     res.status(200).json({
//       success: true,
//       data: reviews,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching user reviews",
//       error: error.message,
//     });
//   }
// };

// DELETE REVIEW
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    //  Delete review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

exports.voteReviewHelpfulness = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { voteType } = req.body; // 'helpful' or 'unhelpful'
    const userId = req.user._id;

    const review = await mongoose.model("Review").findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Initialize arrays if they don't exist
    if (!review.helpfulUsers) review.helpfulUsers = [];
    if (!review.unhelpfulUsers) review.unhelpfulUsers = [];

    // Remove from both first to toggle/change vote
    review.helpfulUsers = review.helpfulUsers.filter(id => id.toString() !== userId.toString());
    review.unhelpfulUsers = review.unhelpfulUsers.filter(id => id.toString() !== userId.toString());

    if (voteType === 'helpful') {
      review.helpfulUsers.push(userId);
    } else if (voteType === 'unhelpful') {
      review.unhelpfulUsers.push(userId);
    }

    await review.save();
    res.status(200).json({ 
      success: true, 
      helpfulCount: review.helpfulUsers.length,
      unhelpfulCount: review.unhelpfulUsers.length 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
