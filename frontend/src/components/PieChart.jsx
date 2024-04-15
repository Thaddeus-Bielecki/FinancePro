import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useGetExpenseByUserIdQuery } from '../slices/expenseApiSlice';
import { useGetLoanByUserIdQuery } from '../slices/loanApiSlice';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

function PieChart() {
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  const { data: expense } = useGetExpenseByUserIdQuery(userInfo._id);
  const { data: loan } = useGetLoanByUserIdQuery(userInfo._id);

  const currentDate = new Date();
  const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

const filteredExpenses = Array.isArray(expense)
  ? expense.filter(item => {
        return new Date(item.date) >= firstDayOfCurrentMonth || item.occursMonthly;
    })
  : [];

const expenseData = filteredExpenses.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = item.amount;
  } else {
    acc[item.category] += item.amount;
  }
  return acc;
}, {});

const expenseCategories = Object.keys(expenseData);
const expenseAmounts = Object.values(expenseData);

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

  const loanCategories = Array.isArray(loan) ?
  loan
  .filter(item => {
    const loanStartDate = new Date(item.startDate);
    const loanEndDate = new Date(loanStartDate.setMonth(loanStartDate.getMonth() + item.duration));
    return loanEndDate >= currentDate;
  })
    .map(item => item.category)
  : [];
  

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Expenses by Category',
      },
    },
  }

  const data = {
    labels: [...expenseCategories, ...loanCategories],
    datasets: [
      {
        // label: 'Expenses', //might need to make loans a new dataset -- not sure how it looks
        data: [...expenseAmounts, ...loanAmounts],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // Red
          'rgba(54, 162, 235, 0.2)', // Blue
          'rgba(255, 206, 86, 0.2)', // Yellow
          'rgba(75, 192, 192, 0.2)', // Teal
          'rgba(153, 102, 255, 0.2)', // Purple
          'rgba(255, 159, 64, 0.2)', // Orange
          'rgba(99, 255, 255, 0.2)', // Light Cyan
          'rgba(255, 99, 255, 0.2)', // Pink
          'rgba(255, 255, 99, 0.2)', // Light Yellow
          'rgba(99, 255, 132, 0.2)', // Light Green
          
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', // Red
          'rgba(54, 162, 235, 1)', // Blue
          'rgba(255, 206, 86, 1)', // Yellow
          'rgba(75, 192, 192, 1)', // Teal
          'rgba(153, 102, 255, 1)', // Purple
          'rgba(255, 159, 64, 1)', // Orange
          'rgba(99, 255, 255, 1)', // Light Cyan
          'rgba(255, 99, 255, 1)', // Pink
          'rgba(255, 255, 99, 1)', // Light Yellow
          'rgba(99, 255, 132, 1)', // Light Green
          
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div style={{width: '100%', padding: '20px'}}>
      <Pie data={data} options={options} />
    </div>
  )
}

export default PieChart
