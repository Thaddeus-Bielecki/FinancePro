import express from 'express';
import { getLoanById, getLoanByUserId, addLoan, deleteLoan, updateLoan } from '../controllers/loanController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route('/')
  // .get(getLoan)
  .post(addLoan);
router.route('/:id')
  .get(getLoanById)
  .delete(deleteLoan)
  .patch(protect, updateLoan);
router.route('/user/:userId').get(getLoanByUserId);

export default router;