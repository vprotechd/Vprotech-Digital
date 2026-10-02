import express from "express";

import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  getInternshipTest,
  startInternshipTest,
} from "../controllers/testController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// =====================================================
// STUDENT - INTERNSHIP TEST
// =====================================================

router.get(
  "/internship/:programId",
  protect,
  getInternshipTest
);

router.post(
  "/:testId/start",
  protect,
  startInternshipTest
);

// =====================================================
// ADMIN TEST MANAGEMENT
// =====================================================

router.post(
  "/",
  protect,
  admin,
  createTest
);

router.get(
  "/",
  protect,
  admin,
  getAllTests
);

router.get(
  "/:id",
  protect,
  admin,
  getTestById
);

router.put(
  "/:id",
  protect,
  admin,
  updateTest
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteTest
);

export default router;