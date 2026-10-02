import express from "express";

import {
  createQuestion,
  getQuestionsForAdmin,
  getQuestionsForStudent,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// =====================================================
// ADMIN
// =====================================================

router.post(
  "/tests/:testId/questions",
  protect,
  admin,
  createQuestion
);

router.get(
  "/tests/:testId/questions",
  protect,
  admin,
  getQuestionsForAdmin
);

router.put(
  "/questions/:id",
  protect,
  admin,
  updateQuestion
);

router.delete(
  "/questions/:id",
  protect,
  admin,
  deleteQuestion
);


// =====================================================
// STUDENT
// Correct answers are NEVER returned
// =====================================================

router.get(
  "/student/tests/:testId/questions",
  protect,
  getQuestionsForStudent
);

export default router;