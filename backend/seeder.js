import mongoose from 'mongoose';
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import User from "./models/userModel.js";
import incomes from "./data/incomes.js";
import Income from "./models/incomeModel.js";
import expenses from "./data/expenses.js";
import Expense from "./models/expenseModel.js";
import loans from "./data/loans.js";
import Loan from "./models/loanModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Income.deleteMany();
        await Expense.deleteMany();
        await Loan.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        //create variable to store the sampleIncomes with the adminUser
        const sampleIncomes = incomes.map(income => {
            return { ...income, user: adminUser }
        });
        await Income.insertMany(sampleIncomes);

        //do the same for expenses and loans
        const sampleExpenses = expenses.map(expense => {
            return { ...expense, user: adminUser }
        });
        await Expense.insertMany(sampleExpenses);

        const sampleLoans = loans.map(loan => {
            return { ...loan, user: adminUser }
        });
        await Loan.insertMany(sampleLoans);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Income.deleteMany();
        await Expense.deleteMany();
        await Loan.deleteMany();

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d'){
    destroyData();
} else {
    importData();
}