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

// @desc    Fetch all incomes by user id
// @route   GET /api/incomes/user/:userId
// @access  Public
const getIncomesByUserId = asyncHandler(async (req, res) => {
    const incomes = await Income.find({ user: req.params.userId });
    if (incomes) {
        res.json(incomes);
    } else {
        res.status(404);
        throw new Error('Incomes not found');
    }
});

// @desc    Add a new incomes
// @route   POST /api/incomes
// @access  Private
const addIncome = asyncHandler(async (req, res) => {
    const { userId, source, amount, date, category, occursMonthly } = req.body;
    const newIncome = new Income({
        user: userId,
        source,
        amount,
        date,
        category,
        occursMonthly
    });
    const addedIncome = await newIncome.save();
    res.json(addedIncome);
})

// @desc    Delete an incomes
// @route   DELETE /api/incomes/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
    
    const income = await Income.findById(req.params.id);
    if (income) {
        await Income.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Income removed' });
    } else {
        res.status(404);
        throw new Error('Income not found');
    }
})

// @desc    modify an income
// @route   PATCH /api/incomes
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
    const { source, amount, date, occursMonthly } = req.body;
    const { id } = req.params;
    const income = await Income.findById(id);

    if (income) {
        income.source = source;
        income.amount = amount;
        income.date = date;
        income.occursMonthly = occursMonthly;
        const updatedIncome = await income.save();
        res.json(updatedIncome);
    } else {
        res.status(404);
        throw new Error('Income not found');
    }
})

export { getIncomes, getIncomeById, getIncomesByUserId, 
    addIncome, deleteIncome, updateIncome };