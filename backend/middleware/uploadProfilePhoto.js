import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const uploadsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads"
);

const createPhotoUpload = (folder) => {
  const destination = path.join(uploadsDirectory, folder);
  fs.mkdirSync(destination, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, destination),
    filename: (_req, file, callback) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path
        .extname(file.originalname)
        .toLowerCase()}`;
      callback(null, filename);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error("Only JPG, PNG and WEBP images are allowed."));
      }
    },
  }).single("photo");
};

export const uploadStudentPhoto = createPhotoUpload("student-photos");

const employeePhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vprotech/employees",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadEmployeePhoto = multer({
  storage: employeePhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Only JPG, PNG and WEBP images are allowed."));
    }
  },
}).single("photo");
