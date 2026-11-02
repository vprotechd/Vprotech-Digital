
import Admission from "../models/Admission.js";
import Counter from "../models/Counter.js";

// ==========================================
// CREATE ADMISSION
// ==========================================

export const createAdmission = async (req, res) => {
  try {
    const {
      studentName,
      fatherName,
      dateOfBirth,
      gender,
      aadhaarLast4,
      contactNumber,
      email,
      qualification,
      trainingCourse,
      duration,
      previousExperience,
      batchTiming,
      temporaryAddress,
      permanentAddress,
    } = req.body;

    const requiredFields = {
      studentName,
      fatherName,
      dateOfBirth,
      gender,
      contactNumber,
      email,
      qualification,
      trainingCourse,
      duration,
      batchTiming,
      temporaryAddress,
      permanentAddress,
    };

    const missingField = Object.entries(requiredFields)
      .find(([key, value]) =>
        typeof value !== "string" || !value.trim()
      );

    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField[0]} is required.`,
      });
    }

    if (!/^[0-9]{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit contact number.",
      });
    }

    if (aadhaarLast4 && !/^[0-9]{4}$/.test(aadhaarLast4)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar must contain exactly 4 digits.",
      });
    }

    const dob = new Date(dateOfBirth);

    if (
      Number.isNaN(dob.getTime()) ||
      dob >= new Date() ||
      dob.getFullYear() < 1900
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date of birth.",
      });
    }

    const admission = new Admission({
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      dateOfBirth: dob,
      gender,
      aadhaarLast4,
      contactNumber,
      email: email.trim().toLowerCase(),
      qualification,
      trainingCourse,
      duration,
      previousExperience: typeof previousExperience === "string"
        ? previousExperience.trim()
        : "",
      batchTiming,
      temporaryAddress,
      permanentAddress,
      status: "Pending",
    });

    const counter = await Counter.findByIdAndUpdate(
  "admission",
  { $inc: { sequence: 1 } },
  { new: true, upsert: true }
);

admission.admissionNumber = `ADM-${String(counter.sequence).padStart(3, "0")}`;

await admission.save();
    return res.status(201).json({
      success: true,
      message: "Admission application submitted successfully.",
      admission,
    });

  } catch (error) {
    console.error("Create admission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit admission application.",
    });
  }
};


// ==========================================
// GET ALL ADMISSIONS
// ==========================================

export const getAllAdmissions = async (req, res) => {
  try {
    const { status, course, search } = req.query;

    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (course && course !== "All") {
      filter.trainingCourse = course;
    }

    if (search?.trim()) {
      const regex = {
        $regex: search.trim(),
        $options: "i",
      };

      filter.$or = [
        { studentName: regex },
        { fatherName: regex },
        { email: regex },
        { contactNumber: regex },
        { admissionNumber: regex },
      ];
    }

    const admissions = await Admission.find(filter)
      .select("+aadhaarLast4")
      .sort({ createdAt: -1 })
      .lean();

    const admissionsWithExperience = admissions.map((admission) => ({
      ...admission,
      previousExperience: [
        admission.previousExperience,
        admission.experience,
        admission.workExperience,
      ].find((value) => typeof value === "string" && value.trim())?.trim() || "",
    }));

    return res.status(200).json({
      success: true,
      count: admissionsWithExperience.length,
      admissions: admissionsWithExperience,
    });

  } catch (error) {
    console.error("Get admissions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admission records.",
    });
  }
};


// ==========================================
// GET SINGLE ADMISSION
// ==========================================

export const getAdmissionById = async (req, res) => {
  try {
    const admission = await Admission.findById(req.params.id)
      .select("-aadhaarLast4");

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admission,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admission.",
    });
  }
};


// ==========================================
// UPDATE ADMISSION
// ==========================================

export const updateAdmission = async (req, res) => {
  try {
    const allowedFields = [
      "admissionFee",
      "trainingFee",
      "committeeReport",
      "status",
      "batchTiming",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.status &&
      !["Pending", "Approved", "Rejected"].includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid admission status.",
      });
    }

    for (const field of [
      "registrationFee",
      "admissionFee",
      "trainingFee",
    ]) {
      if (
        updates[field] !== undefined &&
        (!Number.isFinite(Number(updates[field])) ||
          Number(updates[field]) < 0)
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${field}.`,
        });
      }

      if (updates[field] !== undefined) {
        updates[field] = Number(updates[field]);
      }
    }

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-aadhaarLast4");

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admission updated successfully.",
      admission,
    });

  } catch (error) {
    console.error("Update admission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update admission.",
    });
  }
};


// ==========================================
// DELETE ADMISSION
// ==========================================

export const deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admission deleted successfully.",
    });

  } catch (error) {
    console.error("Delete admission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete admission.",
    });
  }
};
