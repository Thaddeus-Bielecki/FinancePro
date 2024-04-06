import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ListGroup } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useGetPayPalClientIdQuery, usePayOrderMutation } from '../slices/ordersApiSlice';

const BecomeMember = () => {
  const [plan, setPlan] = useState('regular'); // Default to 'student' plan
  const planCosts = { student: 10, regular: 20 }; // Replace with actual costs

  const { userInfo } = useSelector((state) => state.auth);
  const isStudent = userInfo.email.endsWith('.edu');

  const [payOrder, { isLoading: payLoading }] = usePayOrderMutation();

  const [{isPending}, paypalDispatch] = usePayPalScriptReducer();


  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };


  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
        if (!window.paypal) {
          loadPaypalScript();
        }
    }
  }, [errorPayPal, loadingPayPal, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function() {
      try {

        const updatedUser = { ...userInfo, isMember: true };
        await payOrder(updatedUser);
        toast.success("Order has been paid");
      } catch (err) {
        toast.error(err.message);
      }
      toast.success("Order has been paid");
    });

    
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: planCosts[plan] // Use the cost of the selected plan
        }
      }]
    });
  }

  return (
    <>
    {userInfo.isMember ? 
    <>
      <h1>Thank you for becoming a member!</h1>
    </>
    :(
    <>
      <h1>Become a member of FinancePro today and take control of your finances!</h1>
      <select value={plan} onChange={handlePlanChange}>
        {isStudent && <option value="student">Student Plan</option>}
        <option value="regular">Regular Plan</option>
      </select>
      
      <ListGroup.Item>
        <div>
          <PayPalButtons 
            key={plan}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            ></PayPalButtons>
        </div>
      </ListGroup.Item>
    </>)}
    </>
  );
}

export default BecomeMember;