import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useGetIncomesByUserIdQuery } from '../slices/incomeApiSlice';
import { useGetExpenseByUserIdQuery } from '../slices/expenseApiSlice';
import { useGetLoanByUserIdQuery } from '../slices/loanApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function ExpenseBarChart() {
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  const { data: income, isLoading, isError, refetch } = useGetIncomesByUserIdQuery(userInfo._id);
  const { data: expense } = useGetExpenseByUserIdQuery(userInfo._id);
  const { data: loan } = useGetLoanByUserIdQuery(userInfo._id);
  // const { data: loan } = useGetLoanByUserIdQuery(userInfo._id);

  const currentDate = new Date();
  const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  const incomeAmounts = Array.isArray(income) ? 
  income
  .filter(item => {
      return new Date(item.date) >= firstDayOfCurrentMonth || item.occursMonthly;
  })
    .map(item => item.amount) 
  : [];

  const expenseAmounts = Array.isArray(expense) ?
  expense
  .filter(item => {
      return new Date(item.date) >= firstDayOfCurrentMonth || item.occursMonthly;
  })
    .map(item => item.amount) 
  : [];

  const loanAmounts = Array.isArray(loan) ?
  loan
    // .filter(item => new Date(item.startDate) >= firstDayOfCurrentMonth)
    // Not sure if we want Loans to be the same as incomes and expenses
    .filter(item => {
      const loanStartDate = new Date(item.startDate);
      const loanEndDate = new Date(loanStartDate.setMonth(loanStartDate.getMonth() + item.duration));
      return loanEndDate >= currentDate;
    })
    .map(item => {
      const r = item.interestRate / 12 / 100; // Convert annual interest rate to monthly and from percentage to decimal
      const PV = item.amount;
      const n = item.duration;
      const monthlyPayment = (r * PV) / (1 - Math.pow(1 + r, -n));
      return monthlyPayment;
    })
  : [];

  const totalIncome = incomeAmounts.reduce((total, amount) => total + amount, 0);
  const totalExpense = expenseAmounts.reduce((total, amount) => total + amount, 0);
  const totalLoan = loanAmounts.reduce((total, amount) => total + amount, 0);


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expenses vs Loan Payments',
      },
    },
  };
  
  const labels = ['Total Expenses vs Total Loan Payments'];
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Expenses',
        data: [totalExpense],
        backgroundColor: [
          'rgba(153, 102, 255, 0.2)', // Purple
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)', // Purple
        ],
        borderWidth: 1,
      },
      {
        label: 'Total Loan Payments',
        data: [totalLoan],
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)', // Orange
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)', // Orange
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  )
}

export default ExpenseBarChart;