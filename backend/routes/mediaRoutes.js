
import express from "express";

import {
  getMedia,
  uploadMedia as uploadMediaController,
  deleteMedia,
} from "../controllers/mediaController.js";

import { protect, admin } from "../middleware/auth.js";
import uploadMediaMiddleware from "../middleware/uploadMedia.js";

const router = express.Router();

// Public route: Website can fetch image URLs
router.get("/", getMedia);

// Admin routes: Only authenticated admins can manage images
router.post(
  "/upload",
  protect,
  admin,
  uploadMediaMiddleware.single("image"),
  uploadMediaController
);

router.delete("/:key", protect, admin, deleteMedia);

export default router;
