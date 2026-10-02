import express from "express";

import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  getInternshipTest,
} from "../controllers/testController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// =====================================================
// STUDENT - INTERNSHIP TEST
// =====================================================

// Get available internship test
// Only shortlisted students can access
router.get(
  "/internship/:programId",
  protect,
  getInternshipTest
);


// =====================================================
// ADMIN - TEST MANAGEMENT
// =====================================================

// Create test
router.post(
  "/",
  protect,
  admin,
  createTest
);

// Get all tests
router.get(
  "/",
  protect,
  admin,
  getAllTests
);

// Get single test
router.get(
  "/:id",
  protect,
  admin,
  getTestById
);

// Update test
router.put(
  "/:id",
  protect,
  admin,
  updateTest
);

// Delete test
router.delete(
  "/:id",
  protect,
  admin,
  deleteTest
);

export default router;