import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetExpenseByUserIdQuery, useAddExpenseMutation,
  useDeleteExpenseMutation, useUpdateExpenseMutation } from '../slices/expenseApiSlice';
import Loader from '../components/Loader';
import { Table, Col, Row, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify'

const ExpenseTracking = () => {
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  // console.log(userInfo)
  const { data: expense, isLoading, isError, refetch } = useGetExpenseByUserIdQuery(userInfo._id);
  const [addExpenseMutation, { isLoading:loadingAddExpense}] = useAddExpenseMutation();
  const [deleteExpenseMutation, {isLoading: loadingUpdateExpense}] = useDeleteExpenseMutation();
  const [updateExpenseMutation, {isLoading: loadingDeleteExpense}] = useUpdateExpenseMutation();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [occursMonthly, setOccursMonthly] = useState(true);



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInfo._id)
    if (!userInfo) {
      toast.error('User information is not available');
      return;
    }
    try{
      await addExpenseMutation({ userId, source, amount, date, category, occursMonthly}).unwrap();
      setSource('');
      setAmount('');
      setDate('');
      setCategory('');
      setOccursMonthly(true);
      refetch();
    }catch(err){
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
  };

  const handleDeleteSubmit = async (id) => {
    try {
      await deleteExpenseMutation(id).unwrap();
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
      await updateExpenseMutation({id: updateId, source, amount, date, category, occursMonthly }).unwrap();
      setShowUpdateForm(false);
      setUpdateId(null);
      setSource('');
      setAmount('');
      setDate('');
      setCategory('');
      setOccursMonthly(true);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
  }
  console.log(userInfo)
console.log('the expense state -->', expense)

  return (
    <>
    {isLoading ? <Loader /> 
    : isError ? <h2>Failed to fetch expenses</h2> 
    : (
    <>
      <div className='text-center'>
        <h1>Ready to track your Expenses?</h1>
        <h3>Here are your expenses:</h3>
      </div>
      <Row>
        <Col md="2"></Col>
        <Col md="8">

          {/* Table displaying expenses */}
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
              {expense.map((item, index) =>(
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
              {loadingDeleteExpense && <Loader />}
            </tbody>
          </Table>

          {/* Form to allow for updating existing expenses */}
          {showUpdateForm && (<>
            <div className='update-form'>
              <h2>Update Expenses</h2>
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
                      <option value='Option 1'>College</option>
                      <option value='Option 2'>Gas Station</option>
                      <option value='Option 3'>Grocery Store</option>
                      <option value='Option 4'>Restaurant</option>
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

                <Form.Group controlId='category' className='my-2'>
                <Form.Label>Category</Form.Label>
                {userInfo.isMember ? 
                  (
                    <Form.Control 
                      type='text' 
                      value={category}
                      onChange={(e) => setSource(e.target.value)} 
                      placeholder='Category' 
                      required 
                      maxLength='50'/>
                  ) : (
                  <Form.Control 
                    as='select' 
                    value={category} 
                    onChange={(e) => setSource(e.target.value)}>
                      <option value='Option 1'>Dinning</option>
                      <option value='Option 2'>Education</option>
                      <option value='Option 3'>Entertainment</option>
                      <option value='Option 4'>Groceries</option>
                      <option value='Option 5'>Car</option>
                      <option value='Option 6'>Rent/Mortgage</option>
                      <option value='Option 7'>Utilities</option>
                      {/* Add more options as needed */}
                  </Form.Control>
                )}
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
                {loadingUpdateExpense && <Loader />}
              </Form>
            </div>
          </>)}
        </Col>

        {/* Form to allow the user to enter new expenses */}
        {userInfo.isMember || expense.length < 1 ? (
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
                    <option value='Option 1'>College</option>
                      <option value='Option 2'>Gas Station</option>
                      <option value='Option 3'>Grocery Store</option>
                      <option value='Option 4'>Restaurant</option>
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

          <Form.Group controlId='category' className='my-2'>
                <Form.Label>Category</Form.Label>
                {userInfo.isMember ? 
                  (
                    <Form.Control 
                      type='text' 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)} 
                      placeholder='Category' 
                      required 
                      maxLength='50'/>
                  ) : (
                  <Form.Control 
                    as='select' 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}>
                      <option value='Option 1'>Dinning</option>
                      <option value='Option 2'>Education</option>
                      <option value='Option 3'>Entertainment</option>
                      <option value='Option 4'>Groceries</option>
                      <option value='Option 5'>Gas</option>
                      <option value='Option 6'>Rent/Mortgage</option>
                      <option value='Option 7'>Utilities</option>
                      {/* Add more options as needed */}
                  </Form.Control>
                )}
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
            {loadingAddExpense && <Loader />}
        </Form>
        </>
        ) : (
          <h2>Upgrade to a member to add more expenses</h2>
        )}
        <Col md="2"></Col>
      </Row>
    </>
    )}
    </>
  )
}

export default ExpenseTracking