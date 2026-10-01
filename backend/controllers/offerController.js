import asyncHandler from "express-async-handler";
import Offer from "../models/Offer.js";

export const getPopupOffers = asyncHandler(async (req, res) => {
  try {
    const now = new Date();

    console.log("====================================");
    console.log("POPUP OFFERS");
    console.log("Current time:", now);

    // Get all offers first for debugging
    const allOffers = await Offer.find({})
      .select(
        "title isActive showPopup startDate endDate priority"
      )
      .lean();

    console.log("Total offers:", allOffers.length);

    console.log(
      "Offers:",
      allOffers.map((offer) => ({
        id: offer._id,
        title: offer.title,
        isActive: offer.isActive,
        showPopup: offer.showPopup,
        startDate: offer.startDate,
        endDate: offer.endDate,
      }))
    );

    const offers = await Offer.find({
      // Must be active
      isActive: true,

      // Popup must be enabled
      $or: [
        { showPopup: true },
        { showPopup: { $exists: false } },
      ],

      // Start date
      $and: [
        {
          $or: [
            { startDate: null },
            { startDate: { $exists: false } },
            { startDate: { $lte: now } },
          ],
        },

        // End date
        {
          $or: [
            { endDate: null },
            { endDate: { $exists: false } },
            { endDate: { $gte: now } },
          ],
        },
      ],
    })
      .sort({
        priority: -1,
        createdAt: -1,
      })
      .select("-createdBy -__v")
      .lean();

    console.log("Popup eligible offers:", offers.length);
    console.log("====================================");

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error("Get popup offers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch popup offers",
      error: error.message,
    });
  }
});

// ======================================================
// GET ALL OFFERS - ADMIN
// GET /api/offers/admin/all
// ======================================================
export const getAdminOffers = asyncHandler(async (req, res) => {
  const offers = await Offer.find()
    .sort({
      priority: -1,
      createdAt: -1,
    })
    .populate("createdBy", "name email")
    .select("-__v");

  res.status(200).json({
    success: true,
    count: offers.length,
    data: offers,
  });
});

// ======================================================
// GET SINGLE OFFER - ADMIN
// GET /api/offers/:id
// ======================================================
export const getOfferById = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  res.status(200).json({
    success: true,
    data: offer,
  });
});

// ======================================================
// CREATE OFFER - ADMIN
// POST /api/offers
// ======================================================
export const createOffer = asyncHandler(async (req, res) => {
  const {
    title,
    courseName,
    courseSlug,
    description,
    image,
    originalPrice,
    offerPrice,
    discountPercentage,
    buttonText,
    buttonLink,
    isActive,
    showPopup,
    startDate,
    endDate,
    priority,
  } = req.body;

  // Required fields
  if (!title || !courseName || !courseSlug) {
    res.status(400);
    throw new Error(
      "Title, course name and course slug are required"
    );
  }

  // Validate prices
  if (
    originalPrice === undefined ||
    originalPrice === null ||
    offerPrice === undefined ||
    offerPrice === null
  ) {
    res.status(400);
    throw new Error("Original price and offer price are required");
  }

  if (Number(offerPrice) > Number(originalPrice)) {
    res.status(400);
    throw new Error(
      "Offer price cannot be greater than original price"
    );
  }

  // Calculate discount automatically if not supplied
  let calculatedDiscount = Number(discountPercentage);

  if (
    discountPercentage === undefined ||
    discountPercentage === null ||
    discountPercentage === ""
  ) {
    calculatedDiscount =
      Number(originalPrice) > 0
        ? Math.round(
            ((Number(originalPrice) - Number(offerPrice)) /
              Number(originalPrice)) *
              100
          )
        : 0;
  }

  const offer = await Offer.create({
    title,
    courseName,
    courseSlug,
    description: description || "",
    image: image || "",
    originalPrice: Number(originalPrice),
    offerPrice: Number(offerPrice),
    discountPercentage: calculatedDiscount,
    buttonText: buttonText || "View Course",
    buttonLink: buttonLink || "/courses",
   isActive:
  isActive === undefined
    ? true
    : isActive === true || isActive === "true",

showPopup:
  showPopup === undefined
    ? true
    : showPopup === true || showPopup === "true",
    startDate: startDate || null,
    endDate: endDate || null,
    priority: Number(priority) || 0,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Offer created successfully",
    data: offer,
  });
});

// ======================================================
// UPDATE OFFER - ADMIN
// PUT /api/offers/:id
// ======================================================
export const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  const {
    title,
    courseName,
    courseSlug,
    description,
    image,
    originalPrice,
    offerPrice,
    discountPercentage,
    buttonText,
    buttonLink,
    isActive,
    showPopup,
    startDate,
    endDate,
    priority,
  } = req.body;

  if (title !== undefined) offer.title = title;
  if (courseName !== undefined) offer.courseName = courseName;
  if (courseSlug !== undefined) offer.courseSlug = courseSlug;
  if (description !== undefined) offer.description = description;
  if (image !== undefined) offer.image = image;

  if (originalPrice !== undefined) {
    offer.originalPrice = Number(originalPrice);
  }

  if (offerPrice !== undefined) {
    offer.offerPrice = Number(offerPrice);
  }

  if (offer.originalPrice < offer.offerPrice) {
    res.status(400);
    throw new Error(
      "Offer price cannot be greater than original price"
    );
  }

  // Recalculate discount when prices change
  if (
    originalPrice !== undefined ||
    offerPrice !== undefined
  ) {
    offer.discountPercentage =
      offer.originalPrice > 0
        ? Math.round(
            ((offer.originalPrice - offer.offerPrice) /
              offer.originalPrice) *
              100
          )
        : 0;
  } else if (discountPercentage !== undefined) {
    offer.discountPercentage = Number(discountPercentage);
  }

  if (buttonText !== undefined) {
    offer.buttonText = buttonText;
  }

  if (buttonLink !== undefined) {
    offer.buttonLink = buttonLink;
  }

  if (isActive !== undefined) {
    offer.isActive =
      isActive === true ||
      isActive === "true";
  }

  if (showPopup !== undefined) {
    offer.showPopup =
      showPopup === true ||
      showPopup === "true";
  }

  if (startDate !== undefined) {
    offer.startDate = startDate || null;
  }

  if (endDate !== undefined) {
    offer.endDate = endDate || null;
  }

  if (priority !== undefined) {
    offer.priority = Number(priority) || 0;
  }

  const updatedOffer = await offer.save();

  res.status(200).json({
    success: true,
    message: "Offer updated successfully",
    data: updatedOffer,
  });
});

// ======================================================
// DELETE OFFER - ADMIN
// DELETE /api/offers/:id
// ======================================================
export const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id);

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  await offer.deleteOne();

  res.status(200).json({
    success: true,
    message: "Offer deleted successfully",
  });
});

// ======================================================
// TOGGLE ACTIVE STATUS - ADMIN
// PATCH /api/offers/:id/toggle
// ======================================================
export const toggleOfferStatus = asyncHandler(
  async (req, res) => {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error("Offer not found");
    }

    offer.isActive = !offer.isActive;

    await offer.save();

    res.status(200).json({
      success: true,
      message: `Offer ${
        offer.isActive ? "activated" : "deactivated"
      } successfully`,
      data: offer,
    });
  }
);

// ======================================================
// TOGGLE POPUP - ADMIN
// PATCH /api/offers/:id/toggle-popup
// ======================================================
export const toggleOfferPopup = asyncHandler(
  async (req, res) => {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      res.status(404);
      throw new Error("Offer not found");
    }

    offer.showPopup = !offer.showPopup;

    await offer.save();

    res.status(200).json({
      success: true,
      message: `Popup ${
        offer.showPopup ? "enabled" : "disabled"
      } successfully`,
      data: offer,
    });
  }
);