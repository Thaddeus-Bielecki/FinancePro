import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useGetIncomesByUserIdQuery } from '../slices/incomeApiSlice';
import { useGetExpenseByUserIdQuery } from '../slices/expenseApiSlice';
import { useGetLoanByUserIdQuery } from '../slices/loanApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function BarChart() {
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

  console.log(totalLoan);


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Cash Flow'
      },
    },
  };
  
  const labels = ['income vs total expenses'];
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Income',
        data: [totalIncome],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',// Green
        ],
        borderColor: [
          'rgb(75, 192, 192, 1)', // Green
        ],
        borderWidth: 1,
      },
      {
        label: 'Expenses & Loan payments',
        data: [totalExpense + totalLoan],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // Red
        ],
        borderColor: [
          'rgb(255, 99, 132, 1)', // Red
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

export default BarChart;