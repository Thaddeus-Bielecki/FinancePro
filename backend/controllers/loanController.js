import asyncHandler from '../middleware/asyncHandler.js';
import Loan from '../models/loanModel.js';


// // @desc    Fetch all loans
// // @route   GET /api/loans
// // @access  Public
// const getLoans = asyncHandler(async (req, res) => { 
//     const loans = await Loan.find({});//pass in options to limit the loan  it pulls
//     res.json(loan));
// });

// @desc    Fetch a loan
// @route   GET /api/loan/:id
// @access  Public
const getLoanById = asyncHandler(async (req, res) => {
    const loan = await Loan.findById(req.params.id);
    if(loan) {
        res.json(loan);
    } else {
        res.status(404);
        throw new Error('Loan not found');
    }
});

// @desc    Fetch all loans by user id
// @route   GET /api/loan/user/:userId
// @access  Public
const getLoanByUserId = asyncHandler(async (req, res) => {
    const loan = await Loan.find({ user: req.params.userId });
    if (loan) {
        res.json(loan);
    } else {
        console.log('in the backend else block of loan by user id')
        res.status(404);
        throw new Error('Loans not found');
    }
});

// @desc    Add a new loan
// @route   POST /api/loan
// @access  Private
const addLoan = asyncHandler(async (req, res) => {
    const { userId, lender, amount, startDate, duration, interestRate, category, description } = req.body;
    const newLoan = new Loan({
        user: userId,
        lender,
        amount,
        startDate,
        duration,
        interestRate,
        category,
        description,
    });
    const addedLoan = await newLoan.save();
    res.json(addedLoan);
})

// @desc    Delete an loan
// @route   DELETE /api/loan/:id
// @access  Private
const deleteLoan = asyncHandler(async (req, res) => {
    
    const loan = await Loan.findById(req.params.id);
    if (loan) {
        await Loan.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Loan removed' });
    } else {
        res.status(404);
        throw new Error('Loan not found');
    }
})

// @desc    modify an loan
// @route   PATCH /api/loan/:id
// @access  Private
const updateLoan = asyncHandler(async (req, res) => {
    const { lender, amount, startDate, duration, interestRate, category, description } = req.body;
    const { id } = req.params;
    const loan = await Loan.findById(id);

    if (loan) {
        loan.lender = lender;
        loan.amount = amount;
        loan.startDate = startDate;
        loan.duration = duration;
        loan.interestRate = interestRate;
        loan.category = category;
        loan.description = description;
        const updatedLoan = await loan.save();
        res.json(updatedLoan);
    } else {
        res.status(404);
        throw new Error('Loan not found');
    }
})

export { getLoanById, getLoanByUserId, 
    addLoan, deleteLoan, updateLoan };