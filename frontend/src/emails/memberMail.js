import React from 'react'
import { Email, Item, Span, A, renderEmail } from 'react-html-email'
import emailjs from 'emailjs-com'
import { useSelector } from 'react-redux'
import { useGetExpenseByUserIdQuery } from '../slices/expenseApiSlice'
import { useGetIncomeByUserIdQuery } from '../slices/incomeApiSlice'
import { useGetLoanByUserIdQuery } from '../slices/loanApiSlice'

function memberMail() {
  const { userInfo } = useSelector((state) => state.auth);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, {
        publicKey: 'YOUR_PUBLIC_KEY',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div>
      
    </div>
  )
}

export default memberMail
