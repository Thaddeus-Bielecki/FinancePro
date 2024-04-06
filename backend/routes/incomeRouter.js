import express from 'express';
import { getIncomes, getIncomeById, getIncomesByUserId, addIncome } from '../controllers/incomeController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/')
.get(getIncomes)
.post(addIncome);
router.route('/:id').get(getIncomeById);
router.route('/user/:userId').get(getIncomesByUserId);

export default router;