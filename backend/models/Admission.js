
import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    // PERSONAL DETAILS
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },

    aadhaarLast4: {
      type: String,
      maxlength: 4,
      select: false,
    },

    contactNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // EDUCATIONAL DETAILS
    qualification: {
      type: String,
      required: true,
    },

    trainingCourse: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },

    previousExperience: {
      type: String,
      default: "",
    },

    batchTiming: {
      type: String,
      required: true,
    },

    // ADDRESS DETAILS
    temporaryAddress: {
      type: String,
      required: true,
    },

    permanentAddress: {
      type: String,
      required: true,
    },

    // OFFICE USE
    admissionNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    registrationFee: {
      type: Number,
      default: 0,
    },

    admissionFee: {
      type: Number,
      default: 0,
    },

    trainingFee: {
      type: Number,
      default: 0,
    },

    committeeReport: {
      type: String,
      default: "",
    },

    // APPLICATION STATUS
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
