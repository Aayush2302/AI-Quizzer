import { Quiz } from "../model/quiz.model.js";

const getUniqueQuizzes = async (req, res) => {
  try {
    // Retrieve distinct quiz IDs where quizResults are present
    const quizzes = await Quiz.find({ 'result': { $exists: true, $ne: null } })
      .select('_id'); 

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ success: false, message: 'No quizzes have been submitted yet' });
    }

    // Retrieve the full quiz details using the distinct quiz IDs
    const uniqueQuizzes = await Quiz.find({ '_id': { $in: quizzes.map(q => q._id) } })
    .select('-questions')
      .exec();

    res.status(200).json({ success: true, data: uniqueQuizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default getUniqueQuizzes;
