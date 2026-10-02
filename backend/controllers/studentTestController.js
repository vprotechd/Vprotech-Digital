import Test from "../models/Test.js";

// =====================================================
// GET AVAILABLE TESTS FOR STUDENT
// =====================================================
export const getStudentTests = async (req, res) => {
  try {
    const tests = await Test.find({
      isPublished: true,
    })
      .select(
        "title description duration totalMarks passingMarks questions createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error("Get student tests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch available tests",
      error: error.message,
    });
  }
};