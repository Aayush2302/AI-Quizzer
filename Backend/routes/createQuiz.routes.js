import express from 'express';
import protectRoute from '../middleware/protectRoute.js';

import sendQueryToGroq from '../controller/createQuizController.js';

const router = express.Router();

router.post('/create',protectRoute,sendQueryToGroq);

export default router;