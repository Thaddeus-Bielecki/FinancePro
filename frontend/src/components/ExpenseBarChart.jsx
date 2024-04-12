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
    if (item.occursMonthly) {
      const incomeDate = new Date(item.date);
      const incomeDay = incomeDate.getDate();
      // If today's date is less than the income day, it means the income has not occurred yet this month
      return currentDate.getDate() >= incomeDay;
    } else {
      return new Date(item.date) >= firstDayOfCurrentMonth;
    }
  })
    .map(item => item.amount) 
  : [];

  const expenseAmounts = Array.isArray(expense) ?
  expense
  .filter(item => {
    if (item.occursMonthly) {
      const expenseDate = new Date(item.date);
      const expenseDay = expenseDate.getDate();
      // If today's date is less than the income day, it means the income has not occurred yet this month
      return currentDate.getDate() >= expenseDay;
    } else {
      return new Date(item.date) >= firstDayOfCurrentMonth;
    }
  })
    .map(item => item.amount) 
  : [];

  const loanAmounts = Array.isArray(loan) ?
  loan
    // .filter(item => new Date(item.startDate) >= firstDayOfCurrentMonth)
    // Not sure if we want Loans to be the same as incomes and expenses
    .filter(item => {
      if (item.occursMonthly) {
        const loanDate = new Date(item.startDate);
        const loanDay = loanDate.getDate();
        // If today's date is less than the income day, it means the income has not occurred yet this month
        return currentDate.getDate() >= loanDay;
      } else {
        return new Date(item.startDate) >= firstDayOfCurrentMonth;
      }
    })
    .map(item => {
      const r = item.interestRate / 12 / 100; // Convert annual interest rate to monthly and from percentage to decimal
      const PV = item.amount;
      const n = item.duration;
      const monthlyPayment = (r * PV) / (1 - Math.pow(1 + r, -n));
      return monthlyPayment;
    })
  : [];
  console.log(loanAmounts);

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
  
  const labels = ['income vs total expenses'];//, 'expenses vs loan payments'];
  
  const data = {
    labels: labels,
    datasets: [
      //{
      //   label: 'Income',
      //   data: [totalIncome],
      //   backgroundColor: [
      //     'rgba(75, 192, 192, 0.2)',//green
      //     'rgba(54, 162, 235, 0.2)',//blue

      //     'rgba(255, 99, 132, 0.2)', //red
          
      //     'rgba(255, 206, 86, 0.2)',//yellow
          
      //     'rgba(153, 102, 255, 0.2)',
      //     // "red", "green","blue","orange","brown"
      //   ],
      //   borderColor: [
      //     'rgb(75, 192, 192)',
      //     'rgb(54, 162, 235)',
      //     'rgb(255, 99, 132)',
          
      //     'rgb(255, 206, 86)',
          
      //     'rgb(153, 102, 255)',
      //   ],
      //   borderWidth: 1,
      // },
      // {
      //   label: 'Expenses & Loan payments',
      //   data: [totalExpense + totalLoan],
      //   backgroundColor: [
      //     'rgba(255, 99, 132, 0.2)',
      //     'rgba(255, 206, 86, 0.2)',

      //     'rgba(54, 162, 235, 0.2)',
          
      //     'rgba(75, 192, 192, 0.2)',
      //     'rgba(153, 102, 255, 0.2)',
      //     // "red", "green","blue","orange","brown"
      //   ],
      //   borderColor: [
      //     'rgb(255, 99, 132)',
      //     'rgb(255, 206, 86)',
      //     'rgb(54, 162, 235)',
          
      //     'rgb(75, 192, 192)',
      //     'rgb(153, 102, 255)',
      //   ],
      //   borderWidth: 1,
      // },
      { ////////////////Can make a graph for expenses and loan payments /////////////////////////
        label: 'Expenses & Loan payments',
        data: [totalExpense],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',

          'rgba(54, 162, 235, 0.2)',
          
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          // "red", "green","blue","orange","brown"
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 206, 86)',
          'rgb(54, 162, 235)',
          
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        borderWidth: 1,
      },
      {
        label: 'Expenses & Loan payments',
        data: [totalLoan],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',

          'rgba(54, 162, 235, 0.2)',
          
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          // "red", "green","blue","orange","brown"
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 206, 86)',
          'rgb(54, 162, 235)',
          
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
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