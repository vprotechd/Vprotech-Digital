import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    referenceNumber: {
      type: String,
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

    fatherName: String,
    dateOfBirth: Date,

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: String,
    address: String,
    city: String,
    state: String,
    pinCode: String,

    photo: {
      type: String,
      default: "",
    },

    photoPublicId: {
      type: String,
      select: false,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    department: String,

    joiningDate: Date,

    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },

    // Private: never return this field from public verification.
    salary: {
      type: Number,
      select: false,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Resigned"],
      default: "Active",
    },

    remarks: String,
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;