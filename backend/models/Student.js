import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    fatherName: {
      type: String,
      trim: true,
    },

    dateOfBirth: Date,

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: String,
    state: String,
    pinCode: String,

    photo: {
      type: String,
      default: "",
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    duration: String,
    batch: String,

    trainingMode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
    },

    joiningDate: Date,
    completionDate: Date,

    status: {
      type: String,
      enum: ["Active", "Completed", "Inactive"],
      default: "Active",
    },

    certificateNumber: {
      type: String,
      trim: true,
    },

    certificateIssueDate: Date,

    remarks: String,
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;