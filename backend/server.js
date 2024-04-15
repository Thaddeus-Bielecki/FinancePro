// since we are using type module, we can use import instead of require
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import incomeRouter from './routes/incomeRouter.js';
import expenseRouter from './routes/expenseRouter.js';
import loanRouter from './routes/loanRouter.js';
import userRouter from './routes/userRouter.js';

import cron from 'node-cron';
import nodemailer from 'nodemailer';
import User from './models/userModel.js';
import Income from './models/incomeModel.js';
import Expense from './models/expenseModel.js';
import Loan from './models/loanModel.js';


const port = process.env.PORT || 8000; // frontend is on 3000
connectDB(); //connect to MongoDB

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/loan', loanRouter);
app.use('/api/users', userRouter);
app.get('/api/config/paypal', (req, res) => res.send( { clientId: process.env.PAYPAL_CLIENT_ID} ));

cron.schedule('* * * * *', function() {
    console.log('Running a job at 05:00 at the beginning of the month');
    sendMonthlyEmails();
});

async function sendMonthlyEmails() {
    const users = await User.find({ isMember: true});
    const email = 'financepro.team@gmail.com';
    const password = '123456Twb';

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: email,
            pass: password,
        },
    });

    // const transporter = nodemailer.createTransport({
    // service: 'gmail',
    // auth: {
    //     user: 'financepro.team@gmail.com',
    //     pass: '@63025Twb'
    // }
    // });

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    for (let user of users) {
        // Fetch the incomes, expenses, and loans for the user
        const incomes = await Income.find({ userId: user._id });
        const expenses = await Expense.find({ userId: user._id });
        const loans = await Loan.find({ userId: user._id });

        // Filter the incomes and expenses that have dates within the prior month
        const priorMonthIncomes = incomes.filter(income => income.date >= startOfMonth && income.date <= endOfMonth);
        const priorMonthExpenses = expenses.filter(expense => expense.date >= startOfMonth && expense.date <= endOfMonth);

        // Filter the loans that are still active
        const activeLoans = loans.filter(loan => {
        const loanEndDate = new Date(loan.startDate.getFullYear(), loan.startDate.getMonth() + loan.duration);
        return loanEndDate > currentDate;
        });
    
        // Calculate the total income, expenses, and loan payments
        const totalIncome = priorMonthIncomes.reduce((total, income) => total + income.amount, 0);
        const totalExpenses = priorMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
        const totalLoanPayments = activeLoans.reduce((total, item) => {
            const r = item.interestRate / 12 / 100; // Convert annual interest rate to monthly and from percentage to decimal
            const PV = item.amount;
            const n = item.duration;
            const monthlyPayment = (r * PV) / (1 - Math.pow(1 + r, -n));
            return monthlyPayment + total;
            }, 0);

    users.forEach(async (user) => {
    const mailOptions = {
        from: 'financepro.team@gmail.com',
        to: user.email,
        subject: 'Monthly update',
        text: `Hello ${user.name}, here's your monthly update...
        Your current monthly income is $${totalIncome}.
        Your current monthly expenses are $${totalExpenses}.
        Your current monthly loan payments are $${totalLoanPayments}.
        
        Please login to your account to view more details.
        Have a great day!`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ' + info.response);

    // transporter.sendMail(mailOptions, function(error, info) {
    //     if (error) {
    //     console.log(error);
    //     } else {
    //     console.log('Email sent: ' + info.response);
    //     }
    // });
    });
    }
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));