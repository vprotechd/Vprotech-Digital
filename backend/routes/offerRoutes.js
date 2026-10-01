import express from "express";

import {
  getPopupOffers,
  getAdminOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  toggleOfferPopup,
} from "../controllers/offerController.js";

import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// =====================================
// PUBLIC
// =====================================

router.get("/popup", getPopupOffers);

// =====================================
// ADMIN
// =====================================

router.get("/admin/all", protect, admin, getAdminOffers);

router.get("/:id", protect, admin, getOfferById);

router.post("/", protect, admin, createOffer);

router.put("/:id", protect, admin, updateOffer);

router.delete("/:id", protect, admin, deleteOffer);

router.patch(
  "/:id/toggle",
  protect,
  admin,
  toggleOfferStatus
);

router.patch(
  "/:id/toggle-popup",
  protect,
  admin,
  toggleOfferPopup
);

export default router;