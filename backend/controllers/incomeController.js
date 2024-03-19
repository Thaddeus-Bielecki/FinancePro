import asyncHandler from '../middleware/asyncHandler.js';
import Income from '../models/incomeModel.js';


// @desc    Fetch all incomes
// @route   GET /api/incomes
// @access  Public
const getIncomes = asyncHandler(async (req, res) => { 
    const incomes = await Income.find({});//pass in options to limit the incomes  it pulls
    res.json(incomes);
});

// @desc    Fetch a income
// @route   GET /api/incomes/:id
// @access  Public
const getIncomeById = asyncHandler(async (req, res) => {
    const income = await Income.findById(req.params.id);
    if(income) {
        res.json(income);
    } else {
        res.status(404);
        throw new Error('Income not found');
    }
});

export { getIncomes, getIncomeById };