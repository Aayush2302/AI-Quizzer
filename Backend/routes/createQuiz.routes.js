import express from 'express';
import protectRoute from '../middleware/protectRoute.js';

import sendQueryToGroq from '../controller/createQuizController.js';
import checkAnswerAndSubmit from '../controller/checkAnswerController.js';

const router = express.Router();

router.post('/create',protectRoute,sendQueryToGroq);
router.post('/submit',protectRoute,checkAnswerAndSubmit);

export default router;