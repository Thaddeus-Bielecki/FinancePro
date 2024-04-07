import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetIncomesByUserIdQuery, useAddIncomeMutation,
  useDeleteIncomeMutation, useUpdateIncomeMutation } from '../slices/incomeApiSlice';
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
  const [addIncomeMutation, { isLoading:loadingAddIncome}] = useAddIncomeMutation();
  const [deleteIncomeMutation, {isLoading: loadingUpdateIncome}] = useDeleteIncomeMutation();
  const [updateIncomeMutation, {isLoading: loadingDeleteIncome}] = useUpdateIncomeMutation();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
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

  const handleDeleteSubmit = async (id) => {
    // e.preventDefault();
    // setDeleteId(id);
    try {
      // id = id.toString();
      await deleteIncomeMutation(id).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
  }

  const handleDelete = (id) => {
    setDeleteId(id);
    handleDeleteSubmit(id);
  }

  const handleUpdate = (id) => {
    setShowUpdateForm(true);
    setUpdateId(id);
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateIncomeMutation({id: updateId, source, amount, date, occursMonthly }).unwrap();
      setShowUpdateForm(false);
      setUpdateId(null);
      setSource('');
      setAmount('');
      setDate('');
      setCategory('income');
      setOccursMonthly(true);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
  }
  // console.log(income)
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
        <Col md="2"></Col>
        <Col md="8">

          {/* Table displaying incomes */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Occurs Monthly</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {income.map((item, index) =>(
                <tr key={index}>
                  <td>{item.source}</td>
                  <td>$ {item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                  <td>{item.occursMonthly ? 'Yes' : 'No'}</td>
                  <td>
                    <div className='d-flex justify-content-around'>
                      <Button variant='info' onClick={() => handleUpdate(item._id)}>Update</Button>
                      <Button variant='danger' onClick={() => handleDelete(item._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {loadingDeleteIncome && <Loader />}
            </tbody>
          </Table>

          {/* Form to allow for updating existing incomes */}
          {showUpdateForm && (<>
            <div className='update-form'>
              <h2>Update Income</h2>
              <Form onSubmit={handleUpdateSubmit}>
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
                    type='date' value={date}
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
                  Update
                </Button>
                {loadingUpdateIncome && <Loader />}
              </Form>
            </div>
          </>)}
        </Col>

        {/* Form to allow the user to enter new incomes */}
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
            type='date' value={date}
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
            {loadingAddIncome && <Loader />}
        </Form>
        </>
        ) : (
          <h2>Upgrade to a member to add more income</h2>
        )}
        <Col md="2"></Col>
      </Row>
    </>
    )}
    </>
  )
}

export default IncomeTracking