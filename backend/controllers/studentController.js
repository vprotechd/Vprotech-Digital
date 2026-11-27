
import Student from "../models/Student.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Student upload directory
const uploadDirectory = path.join(
  __dirname,
  "../uploads/student-photos"
);

// Safely delete student photo
const deletePhoto = async (photoPath) => {
  if (!photoPath) return;

  try {
    const filename = path.basename(photoPath);
    const fullPath = path.join(uploadDirectory, filename);

    await fs.unlink(fullPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Photo deletion error:", error.message);
    }
  }
};

// Escape special characters in search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizeOptionalEnums = (data) => {
  for (const field of ["gender", "trainingMode", "status"]) {
    if (data[field] === "") {
      delete data[field];
    }
  }

  return data;
};

// ADD STUDENT
export const addStudent = async (req, res) => {
  try {
    const studentData = normalizeOptionalEnums({ ...req.body });

    if (req.file) {
      studentData.photo = `/uploads/student-photos/${req.file.filename}`;
    }

    const student = await Student.create(studentData);

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    if (req.file) {
      await deletePhoto(`/uploads/student-photos/${req.file.filename}`);
    }

    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message:
        error.code === 11000
          ? "Student ID or Reference Number already exists"
          : error.message,
    });
  }
};

// GET ALL STUDENTS
export const getStudents = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search?.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { studentId: regex },
        { referenceNumber: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { course: regex },
      ];
    }

    const students = await Student.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE STUDENT
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE STUDENT
export const updateStudent = async (req, res) => {
  let newPhotoPath = null;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      if (req.file) {
        await deletePhoto(`/uploads/student-photos/${req.file.filename}`);
      }

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updateData = normalizeOptionalEnums({ ...req.body });

    if (req.file) {
      newPhotoPath = `/uploads/student-photos/${req.file.filename}`;
      updateData.photo = newPhotoPath;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Delete old photo only after successful update
    if (req.file && student.photo) {
      await deletePhoto(student.photo);
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    // Remove newly uploaded photo if update fails
    if (newPhotoPath) {
      await deletePhoto(newPhotoPath);
    }

    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message:
        error.code === 11000
          ? "Student ID or Reference Number already exists"
          : error.message,
    });
  }
};

// DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.deleteOne();

    if (student.photo) {
      await deletePhoto(student.photo);
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUBLIC STUDENT VERIFICATION
export const verifyStudent = async (req, res) => {
  try {
    const { referenceNumber } = req.body;

    if (
      typeof referenceNumber !== "string" ||
      !referenceNumber.trim()
    ) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Reference Number is required",
      });
    }

    const student = await Student.findOne({
      referenceNumber: referenceNumber.trim().toUpperCase(),
      status: { $in: ["Active", "Completed"] },
    }).select(
      "referenceNumber firstName lastName course duration batch trainingMode joiningDate completionDate status certificateNumber certificateIssueDate"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Student record not found for this reference number",
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: "Student verified successfully",
      student,
    });
  } catch (error) {
    console.error("Student verification error:", error);

    res.status(500).json({
      success: false,
      verified: false,
      message: "Unable to verify student",
    });
  }
};
