const wishlistRoutes = require("express").Router();  
const { addToWishlist, getWishlist, removeFromWishlist, clearWishlist } = require("../controllers/WishlistController");
const { validateToken, isCustomer } = require("../middleware/AuthMiddleware");


wishlistRoutes.post("/add-to-wishlist", validateToken, isCustomer, addToWishlist);

wishlistRoutes.get("/", validateToken, isCustomer, getWishlist);

wishlistRoutes.post("/remove", validateToken, isCustomer, removeFromWishlist);

wishlistRoutes.delete("/clear/:userId", clearWishlist);

// wishlistRoutes.get("/check/:userId/:productId");

module.exports = wishlistRoutes;