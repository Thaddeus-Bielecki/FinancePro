// since we are using type module, we can use import instead of require
import express, { response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import {xss} from 'express-xss-sanitizer';
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

// Data sanitization against NoSQL query injection
app.use(mongoSanitize({ replaceWith: '_' }));

// Data sanitization against XSS
app.use(xss());

//'0 5 1 * *' - run at 5:00 on the first day of the month
//'* * * * *' - run every minute -- for testing
cron.schedule('0 5 1 * *', function() {
    console.log('Running a job at 05:00 at the beginning of the month');
    // sendEmail();
    sendMonthlyEmails();
});

async function sendMonthlyEmails() {
    try {
        const users = await User.find({ isMember: true });
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        for (let user of users) {
            // Fetch the incomes, expenses, and loans for the user
            const incomes = await Income.find({ user: user._id });
            const expenses = await Expense.find({ user: user._id });
            const loans = await Loan.find({ user: user._id });

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
                const monthlyPayment = parseFloat(((r * PV) / (1 - Math.pow(1 + r, -n))).toFixed(2));
                return monthlyPayment + total;
            }, 0);
            try{
                sendMail(user.name, user.email, totalIncome, totalExpenses, totalLoanPayments);
            } catch (error) {
                console.error(`Failed to send email to ${user.email}: ${error.message}`);
            }
        }
    } catch (error) {
        console.error(`Failed to send monthly emails: ${error.message}`);
    }
}

function sendMail(name, email, totalIncome, totalExpenses, totalLoanPayments) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })

        const mailConfig = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Monthly Recap',
            text: `Hi ${name}, here's your monthly recap...

            Your current monthly income is $${parseFloat(totalIncome).toFixed(2)}.
            Your current monthly expenses are $${parseFloat(totalExpenses).toFixed(2)}.
            Your current monthly loan payments are $${parseFloat(totalLoanPayments).toFixed(2)}.
            ----------------------------------------------------------------
            Your Overall Cash Flow is $${parseFloat(totalIncome - totalExpenses - totalLoanPayments).toFixed(2)}.
            
            Please login to your account to view more details.
            Have a great day!`
        }

        transporter.sendMail(mailConfig, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        }
        )
    })
}

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/income', incomeRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/loan', loanRouter);
app.use('/api/users', userRouter);
app.get('/api/config/paypal', (req, res) => res.send( { clientId: process.env.PAYPAL_CLIENT_ID} ));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));