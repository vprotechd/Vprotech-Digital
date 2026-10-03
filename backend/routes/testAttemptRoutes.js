import express from "express";

import {
   startTest,
  submitTest,
  getMyAttempt,
  getMyAttempts,
  getAllAttempts,
  getAdminAttempt,
} from "../controllers/testAttemptController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/start/:testId", protect, startTest);
router.post("/:attemptId/submit", protect, submitTest);
router.get("/my/:attemptId", protect, getMyAttempt);
router.get("/my", protect, getMyAttempts);
router.get("/all", protect, admin, getAllAttempts);

router.get(
  "/admin/:attemptId",
  protect,
  admin,
  getAdminAttempt
);

export default router;
