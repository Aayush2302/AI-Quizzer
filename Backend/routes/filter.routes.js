import {fltByGrade,fltBySubject, fltByDate} from "../controller/filterController.js";
import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/ByPercentage',protectRoute,fltByGrade);
router.get('/BySubject',protectRoute,fltBySubject);
router.get('/ByDate',protectRoute,fltByDate);
export default router;