import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetIncomesByUserIdQuery, useAddIncomeMutation } from '../slices/incomeApiSlice';
import Loader from '../components/Loader';
import { Table, Col, Row, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addIncome } from '../slices/incomeApiSlice';
import { toast } from 'react-toastify'

const IncomeTracking = () => {
  // const { data: income, isLoading, isError } = useGetIncomesQuery();
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const { data: income, isLoading, isError } = useGetIncomesByUserIdQuery(userInfo._id);
  const [addIncomeMutation, { isLoading:loadingUpdateIncome}] = useAddIncomeMutation();
  // const dispatch = useDispatch();
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('2024-29-02');
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
      setDate('2024-29-02');
      setCategory('income');
      setOccursMonthly(true);
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
        <h1>Here is your income:</h1>
      </div>
      <Row>
        <Col md="3"></Col>
        <Col md="6">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                {/* <th>Date</th> */}
                <th>Occurs Monthly</th>
              </tr>
            </thead>

            <tbody>
              {income.map((item, index) =>(
                <tr key={index}>
                  <td>{item.source}</td>
                  <td>{item.amount}</td>
                  {/* <td>{item.date}</td> */}
                  <td>{item.occursMonthly ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        <div className='text-center'>
          <h1>Have more bread to track?</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input type='text' value={source}
            onChange={(e) => setSource(e.target.value)} 
            placeholder='Source' required />

          <input type='number' value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} 
            placeholder='Amount' required />

            {/* <input type='date' value={date}
            onChange={(e) => setDate(e.target.value)} 
            placeholder='Date' required /> */}

          <select value={occursMonthly} 
            onChange={(e) => setOccursMonthly(e.target.value === 'true')}>
            <option value='true'>Yes</option>
            <option value='false'>No</option>
          </select>

            <Button type='submit' disabled={isUserInfoLoading}>
              Submit
            </Button>
            {loadingUpdateIncome && <Loader />}
        </form>
        <Col md="3"></Col>
      </Row>
    </>
    )}
    </>
  )
}

export default IncomeTracking