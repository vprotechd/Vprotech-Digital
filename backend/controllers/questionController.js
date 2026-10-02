import Question from "../models/Question.js";
import Test from "../models/Test.js";

// =====================================================
// CREATE QUESTION
// POST /api/tests/:testId/questions
// ADMIN ONLY
// =====================================================
export const createQuestion = async (req, res) => {
  try {
    const { testId } = req.params;

    const {
      questionText,
      options,
      correctAnswer,
      marks,
      explanation,
      order,
    } = req.body;

    if (
      !questionText ||
      !Array.isArray(options) ||
      options.length < 2 ||
      !correctAnswer
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question text, at least 2 options and correct answer are required",
      });
    }

    // Check test
    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    // Correct answer must exist inside options
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must match one of the options",
      });
    }

    const question = await Question.create({
      test: testId,
      questionText: questionText.trim(),
      options: options.map((option) => option.trim()),
      correctAnswer: correctAnswer.trim(),
      marks: Number(marks) || 1,
      explanation: explanation?.trim() || "",
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    console.error("Create question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create question",
    });
  }
};


// =====================================================
// GET QUESTIONS FOR ADMIN
// GET /api/tests/:testId/questions
// ADMIN ONLY
// =====================================================
export const getQuestionsForAdmin = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const questions = await Question.find({ test: testId })
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get admin questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};


// =====================================================
// GET QUESTIONS FOR STUDENT
// This NEVER sends correctAnswer
// =====================================================
export const getQuestionsForStudent = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const questions = await Question.find({ test: testId })
      .select("-correctAnswer -explanation")
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Get student questions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
};


// =====================================================
// UPDATE QUESTION
// PUT /api/questions/:id
// ADMIN ONLY
// =====================================================
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const {
      questionText,
      options,
      correctAnswer,
      marks,
      explanation,
      order,
    } = req.body;

    if (questionText !== undefined) {
      question.questionText = questionText.trim();
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          message: "At least 2 options are required",
        });
      }

      question.options = options.map((option) => option.trim());
    }

    if (correctAnswer !== undefined) {
      question.correctAnswer = correctAnswer.trim();
    }

    // Make sure correct answer is one of the options
    if (!question.options.includes(question.correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must match one of the options",
      });
    }

    if (marks !== undefined) {
      question.marks = Number(marks);
    }

    if (explanation !== undefined) {
      question.explanation = explanation.trim();
    }

    if (order !== undefined) {
      question.order = Number(order);
    }

    const updatedQuestion = await question.save();

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update question",
    });
  }
};


// =====================================================
// DELETE QUESTION
// DELETE /api/questions/:id
// ADMIN ONLY
// =====================================================
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
};