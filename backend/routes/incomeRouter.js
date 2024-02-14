import express from 'express';
import { getIncomes, getIncomeById } from '../controllers/incomeController.js';

const router = express.Router();

router.route('/').get(getIncomes);
router.route('/:id').get(getIncomeById);

export default router;