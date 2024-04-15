import { useEffect, useState } from 'react' // not sure if I need this - he used it for products
import React from 'react'
import { Row, Col } from 'react-bootstrap'
import BarChart from '../components/BarChart';
import ExpenseBarChart from '../components/ExpenseBarChart';
import PieChart from '../components/PieChart';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  return (
    <>
    <h1 className='text-center'>Welcome to Your Dashboard {userInfo.name}</h1>
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