import asyncHandler from '../middleware/asyncHandler.js';
import Expense from '../models/expenseModel.js';


// // @desc    Fetch all ncomes
// // @route   GET /api/ncomes
// // @access  Public
// const getncomes = asyncHandler(async (req, res) => { 
//     const ncomes = await ncome.find({});//pass in options to limit the ncomes  it pulls
//     res.json(ncomes);
// });

// @desc    Fetch an expense by id
// @route   GET /api/expense/:id
// @access  Public
const getExpenseById = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if(expense) {
        res.json(expense);
    } else {
        res.status(404);
        throw new Error('Expense not found');
    }
});

// @desc    Fetch all expenses by user id
// @route   GET /api/expense/user/:userId
// @access  Public
const getExpenseByUserId = asyncHandler(async (req, res) => {
  console.log('in the backend ath the top of the function')
    const expense = await Expense.find({ user: req.params.userId });
    console.log('in the backend')
    console.log(expense);
    if (expense) {
        res.json(expense);
    } else {
        console.log('in the backend else block')
        res.status(404);
        throw new Error('Expenses not found');
    }
});

// @desc    Add a new expense
// @route   POST /api/expense
// @access  Private
const addExpense = asyncHandler(async (req, res) => {
    const { userId, source, amount, date, category, occursMonthly } = req.body;
    const newExpense = new Expense({
        user: userId,
        source,
        amount,
        date,
        category,
        occursMonthly
    });
    const addedExpense = await newExpense.save();
    res.json(addedExpense);
})

// @desc    Delete an expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
    
    const expense = await Expense.findById(req.params.id);
    if (expense) {
        await Expense.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Expense removed' });
    } else {
        res.status(404);
        throw new Error('Expense not found');
    }
})

// @desc    modify an expense
// @route   PATCH /api/expense/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
    const { source, amount, date, category, occursMonthly } = req.body;
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (expense) {
        expense.source = source;
        expense.amount = amount;
        expense.date = date;
        expense.category = category;
        expense.occursMonthly = occursMonthly;
        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } else {
        res.status(404);
        throw new Error('Expense not found');
    }
})

export { getExpenseById, getExpenseByUserId, 
    addExpense, deleteExpense, updateExpense };