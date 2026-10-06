// routes/blogRoutes.js
import express from "express";
import {
  getBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadImage,
  deleteImage,
  togglePublish,
  likeBlog,
  getBlogStats,
} from "../controllers/blogController.js";
import { protect, admin } from "../middleware/auth.js";
import { uploadSingle } from "../middleware/upload.js";

const router = express.Router();

// ============ PUBLIC ROUTES ============
router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.put("/:id/like", likeBlog);

// ============ ADMIN ROUTES ============
router.get("/admin/all", protect, admin, getAllBlogsAdmin);
router.get("/admin/stats", protect, admin, getBlogStats);
router.post("/", protect, admin, uploadSingle, createBlog);
router.put("/:id", protect, admin, uploadSingle, updateBlog);
router.delete("/:id", protect, admin, deleteBlog);
router.put("/:id/toggle-publish", protect, admin, togglePublish);
router.post("/upload", protect, admin, uploadSingle, uploadImage);
router.delete("/image", protect, admin, deleteImage);

export default router;