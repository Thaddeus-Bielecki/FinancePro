const generateMonthlyFinanceEmail = (userData) => {
  //getting date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();// .toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Calculate total income and total expenses
  const totalIncome = userIncome.reduce((total, income) => total + income.amount, 0);
  const totalExpenses = userExpenses.reduce((total, expense) => total + expense.amount, 0);

  // Header
  const header = `
    <div style="background-color: #f4f4f4; padding: 20px;">
      <img src="/assets/logo.png" alt="FinancePro" style="max-width: 200px;">
      <h1>Monthly Finance Summary</h1>
    </div>
  `;
  
  // Introduction
  const introduction = `
    <p>Hi ${userData.name},</p>
    <p>Here's your monthly finance summary for ${currentMonth} ${currentYear}:</p>
  `;
  
  // Finance Summary
  const financeSummary = `
    <h2>Finance Summary</h2>
    
    <h3>Income:</h3>
    <ul>
      ${userIncome.map(income => `<li>${income.name}: $${income.amount}</li>`).join('')}
    </ul>
    
    <h3>Expenses:</h3>
    <ul>
      ${userExpenses.map(expense => `<li>${expense.name}: $${expense.amount}</li>`).join('')}
    </ul>

    <h3>Difference:</h3>
    <p>Income Total: $${totalIncome}</p>
    <p>Expenses Total: $${totalExpenses}</p>
    <p>Difference: $${totalIncome - totalExpenses}</p>
  `;
  
  // Charts and Graphs (not implemented in this example)
  
  // Call to Action
  const callToAction = `
    <p>If you have any questions or need assistance, feel free to contact us.</p>
    <p>Best regards,<br>Your Finance Team</p>
  `;
  
  // Footer
  const footer = `
    <div style="background-color: #f4f4f4; padding: 20px;">
      <p>Contact Us: financepro.team@gmail.com</p>
      <p>Visit Our Website: <a href="http://localhost:3000/">FinancePro</a></p>
      <p>To unsubscribe or manage email preferences, <a href="http://localhost:3000/preferences">click here</a>.</p>
    </div>
  `;
  
  // Combine all sections into the email body
  const emailBody = `
    <html>
      <head>
        <style>
          /* Add any custom CSS styles here */
        </style>
      </head>
      <body>
        ${header}
        ${introduction}
        ${financeSummary}
        ${callToAction}
        ${footer}
      </body>
    </html>
  `;
  
  return emailBody;
};

// Example user data
const userData = {
  name: "John Doe",
  month: "January",
  year: 2024,
  checkingBalance: 5000,
  savingsBalance: 10000,
  income: 3000,
  expenses: 2500,
  budgetStatus: "Within budget"
};

// Generate the email template
const emailTemplate = generateMonthlyFinanceEmail(userData);

console.log(emailTemplate);
