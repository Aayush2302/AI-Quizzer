import { Quiz } from '../model/quiz.model.js';
import User from '../model/user.model.js';
import mongoose from 'mongoose';
const checkAnswerAndSubmit = async (req, res) => {
  try {
    const { quizId, userAnswers, userId } = req.body;
    console.log(quizId);

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
        //   console.log(`Question with ID ${userAnswer.questionId} not found`);
          return; // If the question doesn't exist, skip to the next answer
        }
      
        // Check if the correct answer matches the user's selected answer
        if (question.correctAnswer === userAnswer.selectAnswer) {
        //   console.log(`Correct answer for question ID ${userAnswer.questionId}`);
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
    console.log(quiz.result);
    
    await quiz.save();

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Ensure that you're using the correct quiz _id reference
        user.quizResults.push({
          quizId: quiz._id,  // Use Mongo-generated ObjectId for the quiz reference
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