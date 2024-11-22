import { Quiz } from '../model/quiz.model.js';
import User from '../model/user.model.js';
import mongoose from 'mongoose';

// Sample request body for Submission
// {
//     "quizId": "673e78f12391fc348bb0ef53",
//     "userAnswers": [
//         { "questionId": "673db70a44bdd7e4eb7b7115", "selectAnswer": "1" },
//         { "questionId": "673db70a44bdd7e4eb7b711a", "selectAnswer": "2" }, 
//         ........
//     ],
//     "userId": "673d6cf4676694a38c0f98ca"
// }

const checkAnswerAndSubmit = async (req, res) => {
  try {
    const { quizId, userAnswers, userId } = req.body;
    // console.log(quizId);

    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    let TotalQuestions = quiz.questions.length;

    userAnswers.forEach((userAnswer) => {
        // Create a new ObjectId from the userAnswer.questionId
        const questionId = new mongoose.Types.ObjectId(userAnswer.questionId);
      
        const question = quiz.questions.find((q) => q._id.equals(questionId));
        // Check if the question is found
        if (!question) {
          return; 
        }
        // Check if the correct answer matches the user's selected answer
        if (question.correctAnswer === userAnswer.selectAnswer) {
          score++; // Increment the score if the answer is correct
        }
      });
      
    const result = {
      score,
      TotalQuestions,
      percentage: (score / TotalQuestions) * 100,
    };

    // Store the result in the Quiz document
    quiz.result = result;  
    // console.log(quiz.result);

    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // This removes time
    quiz.completedDate = dateOnly;
  
    await quiz.save();

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.quizResults.push({
          quizId: quiz._id,  // Used Mongo-generated ObjectId 
          score: result.score,
          percentage: result.percentage,
        });
        await user.save();
      }
    }

    res.status(200).json({ success: true, data: 'Quiz submitted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default checkAnswerAndSubmit;
