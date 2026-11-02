
import express from "express";

import {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
} from "../controllers/admissionController.js";

import {
  protect,
  admin,
} from "../middleware/auth.js";

const router = express.Router();

// PUBLIC: Student submits admission form
router.post("/", createAdmission);

// ADMIN ONLY: View all admissions
router.get("/", protect, admin, getAllAdmissions);

// ADMIN ONLY: View individual admission
router.get("/:id", protect, admin, getAdmissionById);

// ADMIN ONLY: Update admission
router.put("/:id", protect, admin, updateAdmission);

// ADMIN ONLY: Delete admission
router.delete("/:id", protect, admin, deleteAdmission);

export default router;
