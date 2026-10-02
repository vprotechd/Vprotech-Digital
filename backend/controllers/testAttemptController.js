import Test from "../models/Test.js";
import Question from "../models/Question.js";
import TestAttempt from "../models/TestAttempt.js";
import InternshipApplication from "../models/InternshipApplication.js";

// =====================================================
// START TEST
// POST /api/test-attempts/start/:testId
// STUDENT
// =====================================================
export const startTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const studentId = req.user._id;

    // =====================================================
    // FIND TEST
    // =====================================================

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // =====================================================
    // CHECK INTERNSHIP APPLICATION
    // ONLY APPROVED STUDENTS CAN START
    // =====================================================

    const application = await InternshipApplication.findOne({
      program: test.program,
      applicant: studentId,
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "You have not applied for this internship.",
      });
    }

    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message:
          "Your internship application has not been approved for the test yet.",
        status: application.status,
      });
    }

    // =====================================================
    // CHECK TEST STATUS
    // =====================================================

    if (test.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "This test is not currently available.",
      });
    }

    // =====================================================
    // CHECK TEST DATE
    // =====================================================

    const now = new Date();

    if (test.startDate && now < new Date(test.startDate)) {
      return res.status(400).json({
        success: false,
        message: "This test has not started yet.",
      });
    }

    if (test.endDate && now > new Date(test.endDate)) {
      return res.status(400).json({
        success: false,
        message: "This test has already ended.",
      });
    }

    // =====================================================
    // CHECK ASSIGNED STUDENTS
    // =====================================================

    if (
      Array.isArray(test.assignedStudents) &&
      test.assignedStudents.length > 0
    ) {
      const isAssigned = test.assignedStudents.some(
        (id) => id.toString() === studentId.toString()
      );

      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this test.",
        });
      }
    }

    // =====================================================
    // CHECK EXISTING IN-PROGRESS ATTEMPT
    // =====================================================

    const existingAttempt = await TestAttempt.findOne({
      student: studentId,
      test: testId,
      status: "in_progress",
    });

    if (existingAttempt) {
      return res.status(200).json({
        success: true,
        message: "Existing test attempt found.",
        attempt: existingAttempt,
        test: {
          _id: test._id,
          title: test.title,
          description: test.description,
          duration: test.duration,
          totalMarks: test.totalMarks,
          passingMarks: test.passingMarks,
          instructions: test.instructions,
        },
      });
    }

    // =====================================================
    // CREATE NEW ATTEMPT
    // =====================================================

    const attempt = await TestAttempt.create({
      student: studentId,
      test: testId,
      startedAt: new Date(),
      answers: [],
      score: 0,
      percentage: 0,
      passed: false,
      status: "in_progress",
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Test started successfully.",
      attempt: {
        _id: attempt._id,
        student: attempt.student,
        test: attempt.test,
        startedAt: attempt.startedAt,
        status: attempt.status,
      },
      test: {
        _id: test._id,
        title: test.title,
        description: test.description,
        duration: test.duration,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        instructions: test.instructions,
      },
    });
  } catch (error) {
    console.error("Start test error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start test.",
    });
  }
};

// =====================================================
// SUBMIT TEST
// POST /api/test-attempts/:attemptId/submit
// STUDENT
// =====================================================
export const submitTest = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.user._id;

    // =====================================================
    // FIND ATTEMPT
    // =====================================================

    const attempt = await TestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Test attempt not found.",
      });
    }

    // =====================================================
    // CHECK OWNERSHIP
    // =====================================================

    if (attempt.student.toString() !== studentId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to submit this attempt.",
      });
    }

    // =====================================================
    // CHECK ATTEMPT STATUS
    // =====================================================

    if (attempt.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "This test attempt has already been submitted.",
      });
    }

    // =====================================================
    // GET TEST
    // =====================================================

    const test = await Test.findById(attempt.test);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found.",
      });
    }

    // =====================================================
    // VERIFY INTERNSHIP APPLICATION
    // =====================================================

    const application = await InternshipApplication.findOne({
      program: test.program,
      applicant: studentId,
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "You have not applied for this internship.",
      });
    }

    if (application.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "You are not approved to take this test.",
      });
    }

    // =====================================================
    // GET QUESTIONS
    // IMPORTANT:
    // Correct answers are fetched ONLY from database.
    // Frontend cannot decide the result.
    // =====================================================

    const questions = await Question.find({
      test: test._id,
    }).sort({
      order: 1,
      createdAt: 1,
    });

    // =====================================================
    // GET ANSWERS FROM FRONTEND
    // =====================================================

    const submittedAnswers = Array.isArray(req.body.answers)
      ? req.body.answers
      : [];

    let score = 0;

    // =====================================================
    // EVALUATE ANSWERS
    // =====================================================

    const evaluatedAnswers = questions.map((question) => {
      const submitted = submittedAnswers.find(
        (answer) =>
          answer?.question?.toString() === question._id.toString()
      );

      const selectedAnswer =
        submitted?.selectedAnswer !== undefined
          ? submitted.selectedAnswer
          : null;

      const isCorrect =
        selectedAnswer !== null &&
        selectedAnswer === question.correctAnswer;

      const marksObtained = isCorrect
        ? Number(question.marks || 0)
        : 0;

      score += marksObtained;

      return {
        question: question._id,
        selectedAnswer,
        isCorrect,
        marksObtained,
      };
    });

    // =====================================================
    // CALCULATE PERCENTAGE
    // =====================================================

    const percentage =
      Number(test.totalMarks) > 0
        ? Number(
            ((score / Number(test.totalMarks)) * 100).toFixed(2)
          )
        : 0;

    // =====================================================
    // CHECK PASS / FAIL
    // =====================================================

    const passed = score >= Number(test.passingMarks);

    // =====================================================
    // CHECK TIME
    // =====================================================

    const elapsedMinutes =
      (Date.now() - new Date(attempt.startedAt).getTime()) /
      (1000 * 60);

    const expired = elapsedMinutes > Number(test.duration);

    // =====================================================
    // SAVE ATTEMPT
    // =====================================================

    attempt.answers = evaluatedAnswers;
    attempt.score = score;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.submittedAt = new Date();

    attempt.status = expired ? "expired" : "submitted";

    await attempt.save();

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: expired
        ? "Test submitted after the allowed time."
        : "Test submitted successfully.",

      result: {
        attemptId: attempt._id,
        score,
        totalMarks: test.totalMarks,
        percentage,
        passingMarks: test.passingMarks,
        passed,
        status: attempt.status,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    console.error("Submit test error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit test.",
    });
  }
};

// =====================================================
// GET MY ATTEMPT
// GET /api/test-attempts/my/:attemptId
// STUDENT
// =====================================================
export const getMyAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await TestAttempt.findById(attemptId)
      .populate(
        "test",
        "title description duration totalMarks passingMarks instructions"
      )
      .populate("student", "name email");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Test attempt not found.",
      });
    }

    // =====================================================
    // CHECK OWNERSHIP
    // =====================================================

    if (
      attempt.student._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this attempt.",
      });
    }

    return res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Get attempt error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test attempt.",
    });
  }
};

// =====================================================
// GET MY TEST ATTEMPTS
// GET /api/test-attempts/my
// STUDENT
// =====================================================
export const getMyAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find({
      student: req.user._id,
    })
      .populate(
        "test",
        "title description duration totalMarks passingMarks"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Get my attempts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test attempts.",
    });
  }
};

// =====================================================
// ADMIN - GET ALL ATTEMPTS
// GET /api/test-attempts/all
// ADMIN ONLY
// =====================================================
export const getAllAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find()
      .populate("student", "name email")
      .populate(
        "test",
        "title totalMarks passingMarks duration"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error("Get all attempts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch test attempts.",
    });
  }
};