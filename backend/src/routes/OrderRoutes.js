const orderRoutes = require("express").Router();

const {
  validateToken,
  isSeller,
  isCustomer,
} = require("../middleware/AuthMiddleware");

const {
  placeOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus,
  getOrderById,
  placeOrderCOD
} = require("../controllers/OrderController");

// ORDER
orderRoutes.post("/place-cod", validateToken, isCustomer, placeOrderCOD);
orderRoutes.get("/my-orders", validateToken, isCustomer, getUserOrders);
orderRoutes.get("/seller-orders", validateToken, isSeller, getSellerOrders);
orderRoutes.put("/status", validateToken, isSeller, updateOrderStatus);
orderRoutes.get("/:id", validateToken, isCustomer, getOrderById);

module.exports = orderRoutes;
