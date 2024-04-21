import { useEffect } from 'react'
import React from 'react'
import { Row, Col } from 'react-bootstrap'
import BarChart from '../components/BarChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import PieChart from '../components/PieChart';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  
  const navigate = useNavigate();
  
  

  // If userInfo does not exist, redirect to login page
  useEffect(() => {
    // If userInfo does not exist, redirect to login page
    if(!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  if(isUserInfoLoading || !userInfo) return (<Loader />);
  return (
    <>
    <h1 className='text-center'>Welcome To Your Personal Dashboard, {userInfo.name}!</h1>
    <Row>
      <Col>
        <div className='my-3'>
          <BarChart />
        </div>
        <div className='my-3'>
          <ExpenseBarChart />
        </div>
      </Col>
      <Col>
        <PieChart />
      </Col>
    </Row>
    </>
  )
}

export default HomeScreen