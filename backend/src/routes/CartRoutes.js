const cartRoutes = require("express").Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/CartController");

const { validateToken } = require("../middleware/AuthMiddleware");

// CART ROUTES
cartRoutes.post("/add", validateToken, addToCart);
cartRoutes.get("/", validateToken, getCart);
cartRoutes.put("/update", validateToken, updateCartItem);
cartRoutes.delete("/remove", validateToken, removeFromCart);
cartRoutes.delete("/clear", validateToken, clearCart);

module.exports = cartRoutes;
