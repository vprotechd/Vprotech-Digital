
import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  verifyStudent,
} from "../controllers/studentController.js";

import { protect, adminOnly } from "../middleware/adminAuth.js";
import { uploadStudentPhoto } from "../middleware/uploadProfilePhoto.js";

const router = express.Router();

// Public verification
router.post("/verify", verifyStudent);

// Admin-only routes
router.post("/", protect, adminOnly, uploadStudentPhoto, addStudent);
router.get("/", protect, adminOnly, getStudents);
router.get("/:id", protect, adminOnly, getStudentById);
router.put("/:id", protect, adminOnly, uploadStudentPhoto, updateStudent);
router.delete("/:id", protect, adminOnly, deleteStudent);

export default router;
