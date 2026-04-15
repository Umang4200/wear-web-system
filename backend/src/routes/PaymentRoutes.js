const express = require("express");
const paymentRouter = express.Router();

const { createRazorpayOrder, verifyPayment } = require("../controllers/PaymentController");
const { validateToken, isCustomer } = require("../middleware/AuthMiddleware");

paymentRouter.get("/create-order", validateToken, isCustomer, createRazorpayOrder);
paymentRouter.post("/verify", validateToken, isCustomer, verifyPayment);

module.exports = paymentRouter; 