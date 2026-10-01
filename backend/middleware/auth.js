

// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Handle both id and _id
      const userId = decoded.id || decoded._id;
      req.user = await User.findById(userId).select("-password -__v");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Please login again."
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Your account has been deactivated"
        });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token. Please login again."
        });
      }
      
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again."
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token"
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized as admin"
    });
  }
};

// Export adminOnly for compatibility
const adminOnly = admin;

export { protect, admin, adminOnly };