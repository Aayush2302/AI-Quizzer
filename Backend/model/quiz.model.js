// quiz.model.js
import mongoose from 'mongoose';

// Question Schema
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [
    {
      id: { type: String, required: true },
      option: { type: String, required: true }
    }
  ],
  correctAnswer: { type: String, required: true, select: false },
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
    result: {
        score: { type: Number, default: 0 },
        TotalQuestions: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 },
    },
    completedDate: {
        type: Date, 
        default: null, // Default value if not completed
      },
});

export const Question = mongoose.model('Question', QuestionSchema);
export const Quiz = mongoose.model('Quiz', quizSchema);
