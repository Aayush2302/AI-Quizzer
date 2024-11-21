import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import {Quiz,Question} from '../model/quiz.model.js';
import User from '../model/user.model.js';

dotenv.config();

const groq = new Groq({ apikey: process.env.GROQ_API_KEY });

// Sample request body for creating a quiz
// {"Grade":"12","Subject":"Physics","TotalQuestions":"10","MaxScore":"10","Difficulty":"EASY","userId":"673d6cf4676694a38c0f98ca"}

const sendQueryToGroq = async (req, res) => {
  try {
    const { Grade, Subject, TotalQuestions, MaxScore, Difficulty,title,userId } = req.body;

    // Construct the payload
    const prompt = `
      Generate a JSON array of quiz questions in the following format:
      [
        {
          "question": "<The question text here>",
          "options": [
            {"option": "<Option 1>", "id": 1},
            {"option": "<Option 2>", "id": 2},
            {"option": "<Option 3>", "id": 3},
            {"option": "<Option 4>", "id": 4}
          ],
          "answer": <Correct option id>
        },
        ...
      ]
      Generate ${TotalQuestions} questions for the ${Grade} grade and ${Subject} subject with ${Difficulty} difficulty level. Ensure the output is valid JSON and contains no additional text.`;

    // Send the request to Groq API
    const APIResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    const rawResponse = APIResponse.choices[0].message.content.trim();

    // Clean the response to extract JSON
    const jsonStartIndex = rawResponse.indexOf("["); // Locate the start of the JSON array
    const jsonEndIndex = rawResponse.lastIndexOf("]") + 1; // Locate the end of the JSON array
    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("Invalid response format: JSON array not found.");
    }
    const jsonResponse = rawResponse.substring(jsonStartIndex, jsonEndIndex);

    // Process the response
    const processData = (rawData) => {
      let quizzes = [];
      try {
        const parsedData = JSON.parse(rawData);

        // response is an array
        if (!Array.isArray(parsedData)) {
          throw new Error("Response is not an array of quiz questions.");
        }

        // Validate and format 
        quizzes = parsedData.map((item) => {
          if (
            typeof item.question !== "string" ||
            !Array.isArray(item.options) ||
            typeof item.answer !== "number"
          ) {
            throw new Error("Invalid question format in response.");
          }

          // Ensure each option is correctly formatted
          item.options.forEach((option) => {
            if (
              typeof option.option !== "string" ||
              typeof option.id !== "number"
            ) {
              throw new Error("Invalid option format in response.");
            }
          });

          return {
            questionText: item.question,
            options: item.options,
            correctAnswer: item.answer,
          };
        });
      } catch (error) {
        throw new Error(
          `Failed to process data: ${error.message}. Raw response: ${rawData}`
        );
      }
      return quizzes;
    };

    // Format the response
    const quizData = processData(jsonResponse);
    // console.log(JSON.stringify(quizData, null, 2)); // Debugging

    // Save to MongoDB
    const savedQuestions = await Question.insertMany(quizData);

    const quiz = new Quiz({
      quizId: `quiz_${Date.now()}`,
      title: `${Grade} ${Subject} Quiz`,
      grade: Grade,
      subject: Subject,
      instructions: "Answer all the questions carefully.",
      questions: savedQuestions.map((q) => q._id),
    });

    const savedQuiz = await quiz.save();

    const populatedQuiz = await Quiz.findById(savedQuiz._id).populate('questions').exec();
    res.status(200).json({ success: true, data: populatedQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export default sendQueryToGroq;
