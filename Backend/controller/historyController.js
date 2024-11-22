import User from "../model/user.model.js";
import { Quiz } from "../model/quiz.model.js";

const getUserQuizzes = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from request parameters

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Find the user and populate quiz IDs
    const user = await User.findById(userId).select('quizResults').populate({
      path: 'quizResults.quizId',
      select: '-questions', // Exclude questions from the quiz details
    });

    if (!user || !user.quizResults.length) {
      return res.status(404).json({ success: false, message: "No quizzes found for this user" });
    }

    // Map the populated quiz details and include scores and percentages
    const quizzes = user.quizResults.map((result) => ({
      quizId: result.quizId._id,
      title: result.quizId.title,
      grade: result.quizId.grade,
      subject: result.quizId.subject,
      instructions: result.quizId.instructions,
      score: result.score,
      percentage: result.percentage,
    }));

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default getUserQuizzes;
