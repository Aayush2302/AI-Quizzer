import express from 'express';
import getUniqueQuizzes from "../controller/historyController.js";
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/uniqueQuizzes',protectRoute, getUniqueQuizzes);

export default router;