import express from 'express';
import { getExpenseById, getExpenseByUserId, addExpense, deleteExpense, updateExpense } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/')
  // .get(getExpense)
  .post(addExpense);
router.route('/:id')
  .get(getExpenseById)
  .delete(deleteExpense)
  .patch(protect, updateExpense);
router.route('/user/:userId').get(getExpenseByUserId);

export default router;