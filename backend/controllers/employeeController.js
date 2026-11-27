
import Employee from "../models/Employee.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee upload directory
const uploadDirectory = path.join(
  __dirname,
  "../uploads/employee-photos"
);

// Safely delete employee photo
const deletePhoto = async (photoPath) => {
  if (!photoPath) return;

  try {
    const filename = path.basename(photoPath);
    const fullPath = path.join(uploadDirectory, filename);

    await fs.unlink(fullPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Employee photo deletion error:", error.message);
    }
  }
};

// Escape special characters in search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizeOptionalFields = (data) => {
  for (const field of ["gender", "employmentType", "status"]) {
    if (data[field] === "") {
      delete data[field];
    }
  }

  if (
    typeof data.referenceNumber === "string" &&
    !data.referenceNumber.trim()
  ) {
    delete data.referenceNumber;
  }

  if (data.salary === "") {
    delete data.salary;
  }

  return data;
};

// ADD EMPLOYEE
export const addEmployee = async (req, res) => {
  try {
    const employeeData = normalizeOptionalFields({ ...req.body });

    if (req.file) {
      employeeData.photo = `/uploads/employee-photos/${req.file.filename}`;
    }

    const employee = await Employee.create(employeeData);

    // Salary is included for the admin response
    const employeeResult = await Employee.findById(employee._id)
      .select("+salary");

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      employee: employeeResult,
    });
  } catch (error) {
    if (req.file) {
      await deletePhoto(`/uploads/employee-photos/${req.file.filename}`);
    }

    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message:
        error.code === 11000
          ? "Employee ID or Reference Number already exists"
          : error.message,
    });
  }
};

// GET ALL EMPLOYEES
export const getEmployees = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search?.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        { employeeId: regex },
        { referenceNumber: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { designation: regex },
        { department: regex },
      ];
    }

    const employees = await Employee.find(filter)
      .select("+salary")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE EMPLOYEE
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .select("+salary");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (req, res) => {
  let newPhotoPath = null;

  try {
    const employee = await Employee.findById(req.params.id)
      .select("+salary");

    if (!employee) {
      if (req.file) {
        await deletePhoto(`/uploads/employee-photos/${req.file.filename}`);
      }

      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const updateData = normalizeOptionalFields({ ...req.body });

    if (req.file) {
      newPhotoPath = `/uploads/employee-photos/${req.file.filename}`;
      updateData.photo = newPhotoPath;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("+salary");

    // Delete old photo after successful update
    if (req.file && employee.photo) {
      await deletePhoto(employee.photo);
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    // Clean up newly uploaded photo if update fails
    if (newPhotoPath) {
      await deletePhoto(newPhotoPath);
    }

    res.status(error.code === 11000 ? 409 : 400).json({
      success: false,
      message:
        error.code === 11000
          ? "Employee ID or Reference Number already exists"
          : error.message,
    });
  }
};

// DELETE EMPLOYEE
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    if (employee.photo) {
      await deletePhoto(employee.photo);
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUBLIC EMPLOYEE VERIFICATION
export const verifyEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (
      typeof employeeId !== "string" ||
      !employeeId.trim()
    ) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Employee ID is required",
      });
    }

    const employee = await Employee.findOne({
      employeeId: employeeId.trim().toUpperCase(),
      status: "Active",
    }).select(
      "employeeId firstName lastName photo designation department joiningDate employmentType status"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: "Active employee record not found for this ID",
      });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: "Employee verified successfully",
      employee,
    });
  } catch (error) {
    console.error("Employee verification error:", error);

    res.status(500).json({
      success: false,
      verified: false,
      message: "Unable to verify employee",
    });
  }
};
