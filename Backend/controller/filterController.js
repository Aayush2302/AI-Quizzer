import { Quiz } from "../model/quiz.model.js";
import  User  from "../model/user.model.js"; 

// we have to provide percentage,condition in query & userId in body
export const fltByGrade = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from the body
    const { percentage, condition } = req.query; // Extract filters from query

    // Validate inputs
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid userId.",
      });
    }

    if (!percentage || !condition) {
      return res.status(400).json({
        success: false,
        message: "Please provide both percentage and condition (>, <, or =).",
      });
    }

    // Map condition to MongoDB operators
    const conditionMap = {
      ">": "$gt",
      "<": "$lt",
      "=": "$eq",
    };

    const operator = conditionMap[condition];
    if (!operator) {
      return res.status(400).json({
        success: false,
        message: "Invalid condition. Use one of: >, <, =",
      });
    }

    // Fetch user's submitted quizzes
    const user = await User.findById(userId).populate("quizResults").exec();
    if (!user || !user.quizResults.length) {
      return res.status(404).json({
        success: false,
        message: "No submitted quizzes found for this user.",
      });
    }

    // Extract unique quiz IDs
    const uniqueQuizIds = [...new Set(user.quizResults.map((quiz) => quiz.quizId))];

    // Query quizzes with the specified grade filter
    const quizzes = await Quiz.find({
      _id: { $in: uniqueQuizIds },
      "result.percentage": { [operator]: parseFloat(percentage) },
    }).select("-questions").exec();

    if (!quizzes.length) {
      return res.status(404).json({ success: false, message: "No quizzes found." });
    }

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};





// we have to provide subject in query/params & userId in body
export const fltBySubject = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from body
    const { subject } = req.query; // Extract subject from query

    // Validate inputs
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid userId.",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Please provide a subject to filter by.",
      });
    }

    // Fetch user's submitted quizzes
    const user = await User.findById(userId).populate("quizResults").exec();
    if (!user || !user.quizResults.length) {
      return res.status(404).json({
        success: false,
        message: "No submitted quizzes found for this user.",
      });
    }

    // Extract unique quiz IDs
    const uniqueQuizIds = [...new Set(user.quizResults.map((quiz) => quiz.quizId))];

    // Query quizzes with the specified subject filter
    const quizzes = await Quiz.find({
      _id: { $in: uniqueQuizIds },
      subject,
    }).select("-questions").exec();

    if (!quizzes.length) {
      return res.status(404).json({ success: false, message: "No quizzes found." });
    }

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// we have to provide date, from, to in query/params & userId in body
export const fltByDate = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from body
    const { date, from, to } = req.query; // Extract date filters from query

    // Validate inputs
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid userId.",
      });
    }

    // Fetch user's submitted quizzes
    const user = await User.findById(userId).populate("quizResults").exec();
    if (!user || !user.quizResults.length) {
      return res.status(404).json({
        success: false,
        message: "No submitted quizzes found for this user.",
      });
    }

    // Extract unique quiz IDs
    const uniqueQuizIds = [...new Set(user.quizResults.map((quiz) => quiz.quizId))];

    // Build date query
    const query = { _id: { $in: uniqueQuizIds } };
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.completedDate = { $gte: startDate, $lte: endDate };
    } else if (from && to) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);

      query.completedDate = { $gte: fromDate, $lte: toDate };
    }

    // Query quizzes with the date filter
    const quizzes = await Quiz.find(query).select("-questions").exec();

    if (!quizzes.length) {
      return res.status(404).json({ success: false, message: "No quizzes found." });
    }

    res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


  