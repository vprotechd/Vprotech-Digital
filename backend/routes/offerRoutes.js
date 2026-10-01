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

const router = express.Router();

// =====================================
// PUBLIC
// =====================================

router.get("/popup", getPopupOffers);

// =====================================
// ADMIN
// =====================================

router.get("/admin/all", getAdminOffers);

router.get("/:id", getOfferById);

router.post("/", createOffer);

router.put("/:id", updateOffer);

router.delete("/:id", deleteOffer);

router.patch("/:id/toggle", toggleOfferStatus);

router.patch("/:id/toggle-popup", toggleOfferPopup);

export default router;