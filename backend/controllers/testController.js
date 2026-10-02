import Test from "../models/Test.js";
import InternshipProgram from "../models/InternshipProgram.js";
import InternshipApplication from "../models/InternshipApplication.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";

// =====================================================
// CREATE TEST
// POST /api/tests
// ADMIN ONLY
// =====================================================
export const createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      program,
      duration,
      totalMarks,
      passingMarks,
      instructions,
      startDate,
      endDate,
      status,
      assignedStudents,
    } = req.body;

    if (
      !title ||
      !program ||
      !duration ||
      !totalMarks ||
      passingMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, program, duration, total marks and passing marks are required",
      });
    }

    // Check whether internship program exists
    const internshipProgram = await InternshipProgram.findById(program);

    if (!internshipProgram) {
      return res.status(404).json({
        success: false,
        message: "Internship program not found",
      });
    }

    // Passing marks cannot be greater than total marks
    if (Number(passingMarks) > Number(totalMarks)) {
      return res.status(400).json({
        success: false,
        message: "Passing marks cannot be greater than total marks",
      });
    }

    const test = await Test.create({
      title: title.trim(),
      description: description?.trim() || "",
      program,
      duration: Number(duration),
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      instructions: Array.isArray(instructions) ? instructions : [],
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "draft",
      assignedStudents: Array.isArray(assignedStudents)
        ? assignedStudents
        : [],
      createdBy: req.user?._id,
    });

    const populatedTest = await Test.findById(test._id)
      .populate("program", "title domain duration")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      test: populatedTest,
    });
  } catch (error) {
    console.error("Create test error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create test",
    });
  }
};


// =====================================================
// GET ALL TESTS
// GET /api/tests
// ADMIN ONLY
// =====================================================
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate("program", "title domain duration")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error("Get all tests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
    });
  }
};


// =====================================================
// GET SINGLE TEST
// GET /api/tests/:id
// ADMIN ONLY
// =====================================================
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("program", "title domain duration")
      .populate("createdBy", "name email");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      test,
    });
  } catch (error) {
    console.error("Get test error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch test",
    });
  }
};


// =====================================================
// UPDATE TEST
// PUT /api/tests/:id
// ADMIN ONLY
// =====================================================
export const updateTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const {
      title,
      description,
      program,
      duration,
      totalMarks,
      passingMarks,
      instructions,
      startDate,
      endDate,
      status,
      assignedStudents,
    } = req.body;

    // If program is being changed, verify it
    if (program !== undefined) {
      const internshipProgram = await InternshipProgram.findById(program);

      if (!internshipProgram) {
        return res.status(404).json({
          success: false,
          message: "Internship program not found",
        });
      }

      test.program = program;
    }

    if (title !== undefined) {
      test.title = title.trim();
    }

    if (description !== undefined) {
      test.description = description.trim();
    }

    if (duration !== undefined) {
      test.duration = Number(duration);
    }

    if (totalMarks !== undefined) {
      test.totalMarks = Number(totalMarks);
    }

    if (passingMarks !== undefined) {
      test.passingMarks = Number(passingMarks);
    }

    if (
      Number(test.passingMarks) >
      Number(test.totalMarks)
    ) {
      return res.status(400).json({
        success: false,
        message: "Passing marks cannot be greater than total marks",
      });
    }

    if (instructions !== undefined) {
      test.instructions = Array.isArray(instructions)
        ? instructions
        : [];
    }

    if (startDate !== undefined) {
      test.startDate = startDate || null;
    }

    if (endDate !== undefined) {
      test.endDate = endDate || null;
    }

    if (status !== undefined) {
      test.status = status;
    }

    if (assignedStudents !== undefined) {
      test.assignedStudents = Array.isArray(assignedStudents)
        ? assignedStudents
        : [];
    }

    const updatedTest = await test.save();

    const populatedTest = await Test.findById(updatedTest._id)
      .populate("program", "title domain duration")
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      test: populatedTest,
    });
  } catch (error) {
    console.error("Update test error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update test",
    });
  }
};


// =====================================================
// DELETE TEST
// DELETE /api/tests/:id
// ADMIN ONLY
// =====================================================
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    await Test.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("Delete test error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete test",
    });
  }
};


// =====================================================
// STUDENT - GET INTERNSHIP TEST
// GET /api/tests/internship/:programId
// SHORTLISTED STUDENTS ONLY
// =====================================================
export const getInternshipTest = async (req, res) => {
  try {
    const { programId } = req.params;
    const studentId = req.user._id;

    // Check student's internship application
    const application = await InternshipApplication.findOne({
      program: programId,
      applicant: studentId,
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message:
          "You have not applied for this internship.",
      });
    }

    // Only admin-approved students can access test
    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          "Your internship application has not been approved for the test yet.",
        status: application.status,
      });
    }

    // Find published test for this internship
    const test = await Test.findOne({
      program: programId,
      status: "published",
    }).populate(
      "program",
      "title domain duration"
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        message:
          "No published test is available for this internship yet.",
      });
    }

    // Check test dates
    const now = new Date();

    if (test.startDate && now < new Date(test.startDate)) {
      return res.status(400).json({
        success: false,
        message: "The test has not started yet.",
      });
    }

    if (test.endDate && now > new Date(test.endDate)) {
      return res.status(400).json({
        success: false,
        message: "The test has ended.",
      });
    }

    // Get questions
    const questions = await Question.find({
      test: test._id,
    })
      .select(
        "_id questionText options marks order"
      )
      .sort({ order: 1 });

    return res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        instructions: test.instructions,
        program: test.program,
      },
      questions,
    });
  } catch (error) {
    console.error(
      "Get internship test error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load internship test",
    });
  }
};


// =====================================================
// STUDENT - START TEST
// POST /api/tests/:testId/start
// SHORTLISTED STUDENTS ONLY
// =====================================================
export const startInternshipTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user._id;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    // Check application
    const application =
      await InternshipApplication.findOne({
        program: test.program,
        applicant: studentId,
      });

    if (!application) {
      return res.status(403).json({
        success: false,
        message:
          "You have not applied for this internship.",
      });
    }

    // Only admin-approved applicants can start.
    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          "Your application has not been approved for the test yet.",
      });
    }

    if (test.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "This test is not currently available.",
      });
    }

    // Check existing attempt
    let attempt = await TestAttempt.findOne({
      student: studentId,
      test: testId,
      status: "in_progress",
    });

    if (!attempt) {
      attempt = await TestAttempt.create({
        student: studentId,
        test: testId,
        startedAt: new Date(),
        status: "in_progress",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test started successfully.",
      attemptId: attempt._id,
      startedAt: attempt.startedAt,
      duration: test.duration,
    });
  } catch (error) {
    console.error(
      "Start internship test error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to start test.",
    });
  }
};