import { useEffect, useState } from 'react' // not sure if I need this - he used it for products
import React from 'react'
import { Row, Col } from 'react-bootstrap'
import BarChart from '../components/BarChart';

const HomeScreen = () => {
  return (
    <>
    <h1>Welcome to Your Dashboard *insert username*!</h1>
    <Row>
      <Col>
        <h2>Bar Chart</h2>
        <BarChart />
      </Col>
      {/* <Col>
        <h2>Line Chart</h2>
        <canvas id="myLineChart" width="100" height="100"></canvas>
      </Col> */}
      
    </Row>
    </>
  )
}

export default HomeScreen