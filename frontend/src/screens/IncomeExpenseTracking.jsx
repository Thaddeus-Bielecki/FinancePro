import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const IncomeExpenseTracking = () => {
  const [income, setIncome] = useState([]) //need to come back and bring in the income from the backend
  //and set up the updating function
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await axios.get('/api/income');
        setIncome(response.data);
      } catch (error) {
        console.error('Failed to fetch income', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();
  }, []);

  if (loading) {
    return < Loader/>;
  }

  return (
    <>
    <h1>Ready to track your I/E?</h1>
    <h1>Here is your income:</h1>
    {income.map((item, index) => (
        <div key={index}>
          <p>Amount: {item.amount}</p>
          <p>Source: {item.source}</p>
        </div>
      ))}
    
    </>
  )
}

export default IncomeExpenseTracking