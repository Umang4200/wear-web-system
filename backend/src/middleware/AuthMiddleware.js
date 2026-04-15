const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      if (token.startsWith("Bearer ")) {
        const tokenValue = token.split(" ")[1];
        const decodedToken = jwt.verify(tokenValue, process.env.JWT_SECRET);
        console.log("decodedToken", decodedToken);
        req.user = decodedToken;

        next();
      } else {
        res.status(401).json({
          success: false,
          message: "Token is not start with Bearer",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        // message: "token is missing",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while validate token",
    });
  }
};

//isCustomer
exports.isCustomer = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(401).json({
        success: false,
        message: "This is Protected routes for customer",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot verified ,please try again.",
    });
  }
};

//isseller
exports.isSeller = async (req, res, next) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(401).json({
        success: false,
        message: "This is Protected routes for seller",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot verified ,please try again.",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is Protected routes for Admin",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot verified ,please try again.",
    });
  }
};
