
import express from "express";

import {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  verifyEmployee,
} from "../controllers/employeeController.js";

// Use the actual exports from your existing adminAuth.js
import { protect, adminOnly } from "../middleware/adminAuth.js";
import { uploadEmployeePhoto } from "../middleware/uploadProfilePhoto.js";

const router = express.Router();

// Public verification
router.post("/verify", verifyEmployee);

// Admin-only employee management
router.post("/", protect, adminOnly, uploadEmployeePhoto, addEmployee);
router.get("/", protect, adminOnly, getEmployees);
router.get("/:id", protect, adminOnly, getEmployeeById);
router.put("/:id", protect, adminOnly, uploadEmployeePhoto, updateEmployee);
router.delete("/:id", protect, adminOnly, deleteEmployee);

export default router;
