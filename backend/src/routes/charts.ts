import { Router } from 'express';
import { getCharts } from '../controllers/chartsController.js';

const router = Router();
router.get('/', getCharts);

export default router;
