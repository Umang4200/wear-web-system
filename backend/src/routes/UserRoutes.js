const userRoutes = require("express").Router();
const { registerUser, loginUser, getUserDetail, updateUserProfile, forgotPassword, verifyOTP, resetPassword } = require("../controllers/UserController");
const { validateToken } = require("../middleware/AuthMiddleware");

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/profile", validateToken, getUserDetail);
userRoutes.put("/profile", validateToken, updateUserProfile);

userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/verify-otp", verifyOTP);
userRoutes.post("/reset-password", resetPassword);

module.exports = userRoutes;
