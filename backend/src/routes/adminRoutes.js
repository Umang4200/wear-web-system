const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/AuthMiddleware");

// Middleware to ensure user is admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied: Admins only" });
  }
};

// All admin routes should be protected by authMiddleware and adminOnly
router.use(authMiddleware.validateToken, authMiddleware.isAdmin);

// User Management Routes
router.route("/users").get(adminController.getAllUsers);
router.route("/users/:id").delete(adminController.deleteUser);

// Seller Management Routes
router.route("/sellers").get(adminController.getAllSellers);
router.route("/sellers/approve/:id").put(adminController.approveSeller);
router.route("/sellers/reject/:id").put(adminController.rejectSeller);

// Dashboard Stats Route
router.route("/dashboard-stats").get(adminController.getDashboardStats);

// Category Management Routes
router.route("/categories").get(adminController.getAllCategories).post(adminController.createCategory);
router.route("/categories/:id").put(adminController.updateCategory).delete(adminController.deleteCategory);

module.exports = router;
