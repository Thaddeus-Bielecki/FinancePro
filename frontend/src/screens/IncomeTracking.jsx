import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetIncomesByUserIdQuery, useAddIncomeMutation } from '../slices/incomeApiSlice';
import Loader from '../components/Loader';
import { Table, Col, Row, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addIncome } from '../slices/incomeApiSlice';
import { toast } from 'react-toastify'

const IncomeTracking = () => {
  // const { data: income, isLoading, isError } = useGetIncomesQuery();
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const { data: income, isLoading, isError, refetch } = useGetIncomesByUserIdQuery(userInfo._id);
  const [addIncomeMutation, { isLoading:loadingUpdateIncome}] = useAddIncomeMutation();
  // const dispatch = useDispatch();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('income');
  const [occursMonthly, setOccursMonthly] = useState(true);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInfo._id)
    // console.log(userInfo)
    if (!userInfo) {
      toast.error('User information is not available');
      return;
    }
    try{
      await addIncomeMutation({ userId, source, amount, date, category, occursMonthly}).unwrap();
      setSource('');
      setAmount('');
      setDate('');
      setCategory('income');
      setOccursMonthly(true);
      refetch();
    }catch(err){
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
    
  };

  return (
    <>
    {isLoading ? <Loader /> 
    : isError ? <h2>Failed to fetch income</h2> 
    : (
    <>
      <div className='text-center'>
        <h1>Ready to track your Income?</h1>
        <h3>Here is your income:</h3>
      </div>
      <Row>
        <Col md="3"></Col>
        <Col md="6">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Occurs Monthly</th>
              </tr>
            </thead>

            <tbody>
              {income.map((item, index) =>(
                <tr key={index}>
                  <td>{item.source}</td>
                  <td>$ {item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                  <td>{item.occursMonthly ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {userInfo.isMember || income.length < 1 ? (
          <>
          <div className='text-center'>
          <h1>Have more bread to track?</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='source' className='my-2'>
            <Form.Label>Source</Form.Label>
              {userInfo.isMember ? 
                (
                  <Form.Control 
                    type='text' 
                    value={source}
                    onChange={(e) => setSource(e.target.value)} 
                    placeholder='Source' 
                    required 
                    maxLength='50'/>
                ) : (
                <Form.Control 
                  as='select' 
                  value={source} 
                  onChange={(e) => setSource(e.target.value)}>
                    <option value='Option 1'>Job</option>
                    {/* <option value='Option 2'>Option 2</option> */}
                    {/* <option value='Option 3'>Option 3</option> */}
                    {/* Add more options as needed */}
                </Form.Control>
              )}
          </Form.Group>

          <Form.Group controlId='amount' className='my-2'>
            <Form.Label>Amount</Form.Label>
              <Form.Control 
                type='number'
                placeholder='Enter $ Amount'
                value={amount}
                onChange={(e) => setAmount(Math.round(Number(e.target.value) * 100) / 100)} 
                required 
                step='0.01'
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='date' className='my-2'>
            <Form.Label>Date</Form.Label>
            <Form.Control
            input type='date' value={date}
            onChange={(e) => setDate(e.target.value)} 
            placeholder='Date' required
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='monthly' className='my-2'>
            <Form.Label>Occurs Monthly?</Form.Label>
            <Form.Control
              as='select' 
              value={occursMonthly} 
              onChange={(e) => setOccursMonthly(e.target.value === 'true')}>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
          </Form.Control>
          </Form.Group>
            
            <Button type='submit' disabled={isUserInfoLoading}>
              Submit
            </Button>
            {loadingUpdateIncome && <Loader />}
        </Form>
        </>
        ) : (
          <h2>Upgrade to a member to add more income</h2>
        )}
        <Col md="3"></Col>
      </Row>
    </>
    )}
    </>
  )
}

export default IncomeTracking