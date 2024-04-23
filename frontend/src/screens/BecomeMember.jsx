import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { ListGroup } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useGetPayPalClientIdQuery, usePayOrderMutation } from '../slices/ordersApiSlice';
import { Row, Col } from 'react-bootstrap';
import { setCredentials } from '../slices/authSlice';

const BecomeMember = () => {
  const [plan, setPlan] = useState('regular'); // Default to 'student' plan
  const planCosts = { student: 4.99, regular: 11.99 }; // Replace with actual costs
  const dispatch = useDispatch();

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
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        dispatch(setCredentials(updatedUser));
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
    <div className='my-5'>
      <div className='text-center'>
        <h1>Thank you for becoming a member!</h1>
      </div>
      </div>
    </>
    :(
    <>
    <div className='my-3'>
    <div className='text-center'>
      <h1>Become a member and take control of your finances today!</h1>
    </div>
    </div>
    <Row>
      <Col md='3'></Col>
      <Col md='6'>
        <div className='my-5'>
          <div className='text-center'>
          <h3>Choose a Plan</h3>
          {isStudent && <p>Student Plan: $4.99</p>}
          <p>Standard Plan: $12.99</p>
          <select value={plan} onChange={handlePlanChange}>
            {isStudent && <option value="student">Student Plan</option>}
            <option value="regular">Standard Plan</option>
          </select>
          </div>
        </div>
        
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
      </Col>
      <Col md='3'></Col>
      </Row>
    </>)}
    </>
  );
}

export default BecomeMember;