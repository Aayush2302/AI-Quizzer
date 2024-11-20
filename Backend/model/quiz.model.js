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
  correctAnswer: { type: String, required: true }
});

// Quiz Schema
const quizSchema = new mongoose.Schema({
  quizId: {
    type: String,
    required: true,
    unique: true,
  },
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
});

export const Question = mongoose.model('Question', QuestionSchema);
export const Quiz = mongoose.model('Quiz', quizSchema);
