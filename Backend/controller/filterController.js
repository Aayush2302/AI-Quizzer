import { Quiz } from "../model/quiz.model.js";
import mongoose from "mongoose";

// have to provide percentage and condition in query/params
export const fltByGrade = async (req,res) =>{
    try{
        //Get percentage & sign from query
        const {percentage,condition}=req.query;

        if (!percentage || !condition) {
            return res.status(400).json({ 
              success: false, 
              message: 'Please provide both percentage and condition (>, <, or =).' 
            });
          }

          const conditionMap = {
            '>': '$gt',
            '<': '$lt',
            '=': '$eq',
          };
      
          // Validate condition
          const operator = conditionMap[condition];
          if (!operator) {
            return res.status(400).json({ 
              success: false, 
              message: 'Invalid condition. Use one of: >, <, =' 
            });
          }
      
          // Construct the query dynamically
          const query = {
            'result.percentage': { [operator]: parseFloat(percentage) }, // Apply condition dynamically
          };

        const quizzes = await Quiz.find(query).select('-questions').exec();

        if(!quizzes || quizzes.length === 0){
            return res.status(404).json({success:false, message: 'No quizzes found'});
        }
        res.status(200).json({success:true, data: quizzes});
    }catch(error){
        console.error(error);
        res.status(500).json({success:false, error: error.message});
    }
};

// we have to provide subject in query/params
export const fltBySubject = async(req,res) =>{
    try{
        const {subject} = req.query;

        if(!subject){
            return res.status(400).json({success:false, message: 'Please provide a subject to filter by.'});
        }

        const query={};
        query.subject=subject;

        const quizzes = await Quiz.find(query).select('-questions').exec();

        if(!quizzes || quizzes.length === 0){
            return res.status(404).json({success:false, message: 'No quizzes found'});
        }
        res.status(200).json({success:true, data: quizzes});
    }catch(error){
        console.error(error);
        res.status(500).json({success:false, error: error.message});
    }
};

// we have to provide date, from, to in query/params
export const fltByDate = async (req, res) => {
    try {
      const { date, from, to } = req.query;
      const query = {};
  
      // Filter by specific date (ignoring time)
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);  // Set to 00:00:00 to ignore time
  
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999); // Set to 23:59:59 to include the full day
  
        query.completedDate = {
          $gte: startDate,
          $lte: endDate,
        };
      }
  
      // Filter by date range (from and to)
      if (from && to) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);  // Set to 00:00:00 to ignore time
  
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999); // Set to 23:59:59 to include the full day
  
        query.completedDate = {
          $gte: fromDate,
          $lte: toDate,
        };
      }
  
      // Fetch quizzes based on the query filters
      const quizzes = await Quiz.find(query).select('-questions').exec();
  
      if (!quizzes || quizzes.length === 0) {
        return res.status(404).json({ success: false, message: 'No quizzes found' });
      }
  
      res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  