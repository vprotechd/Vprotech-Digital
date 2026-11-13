
import asyncHandler from "express-async-handler";
import { randomUUID } from "node:crypto";
import Media from "../models/Media.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all website media
// @route   GET /api/media
// @access  Public
export const getMedia = asyncHandler(async (req, res) => {
  const media = await Media.find().sort({ section: 1, order: 1 });

  res.json({
    success: true,
    count: media.length,
    media,
  });
});

// @desc    Upload or replace website image
// @route   POST /api/media/upload
// @access  Admin
export const uploadMedia = asyncHandler(async (req, res) => {
  const { key, section, alt = "", order = 0 } = req.body;

  if (!key || !section) {
    res.status(400);
    throw new Error("Image key and section are required.");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
    res.status(400);
    throw new Error("Invalid image key.");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Please select an image.");
  }

  const existingMedia = await Media.findOne({ key });

  const newPublicId = `media-${randomUUID()}`;

  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vprotech/media",
        public_id: newPublicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.public_id || !result.secure_url) {
          return reject(new Error("Cloudinary upload failed."));
        }
        resolve(result);
      }
    );

    stream.end(req.file.buffer);
  });

  try {
    const media = await Media.findOneAndUpdate(
      { key },
      {
        key,
        section,
        alt,
        order: Number(order) || 0,
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    // Delete the old Cloudinary image only after the database update succeeds.
    if (existingMedia?.publicId) {
      try {
        await cloudinary.uploader.destroy(existingMedia.publicId, {
          resource_type: "image",
        });
      } catch (deleteError) {
        console.error("Old media cleanup failed:", deleteError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: existingMedia ? "Image replaced successfully." : "Image uploaded successfully.",
      media,
    });
  } catch (error) {
    // Prevent an orphaned Cloudinary upload if the database operation fails.
    await cloudinary.uploader.destroy(uploaded.public_id, {
      resource_type: "image",
    }).catch(() => {});

    throw error;
  }
});

// @desc    Delete website image
// @route   DELETE /api/media/:key
// @access  Admin
export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findOne({ key: req.params.key });

  if (!media) {
    res.status(404);
    throw new Error("Media image not found.");
  }

  await cloudinary.uploader.destroy(media.publicId, {
    resource_type: "image",
  });

  await media.deleteOne();

  res.json({
    success: true,
    message: "Image deleted successfully.",
  });
});
