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

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));