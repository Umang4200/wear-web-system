const reviewRoutes = require("express").Router();
const { addReview, deleteReview, getProductReviews, checkReviewEligibility, voteReviewHelpfulness } = require("../controllers/ReviewController");
const { validateToken, isCustomer, isAdmin, isSeller } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/FileUpload");

reviewRoutes.post("/add", validateToken, isCustomer, upload.array("images", 5), addReview);
reviewRoutes.get("/product-reviews/:productId", getProductReviews);
reviewRoutes.get("/check-eligibility/:productId", validateToken, isCustomer, checkReviewEligibility);
reviewRoutes.post("/vote/:reviewId", validateToken, isCustomer, voteReviewHelpfulness);
reviewRoutes.delete("/delete/:id", validateToken, isCustomer, isAdmin, deleteReview);

module.exports = reviewRoutes;
