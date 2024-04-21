import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetLoanByUserIdQuery, useAddLoanMutation,
  useDeleteLoanMutation, useUpdateLoanMutation } from '../slices/loanApiSlice';
import Loader from '../components/Loader';
import { Table, Col, Row, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify'

const LoanTracking = () => {
  const { userInfo, isLoading: isUserInfoLoading } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const { data: loan, isLoading, isError, refetch } = useGetLoanByUserIdQuery(userInfo._id);
  const [addLoanMutation, { isLoading:loadingAddLoan}] = useAddLoanMutation();
  const [deleteLoanMutation, {isLoading: loadingUpdateLoan}] = useDeleteLoanMutation();
  const [updateLoanMutation, {isLoading: loadingDeleteLoan}] = useUpdateLoanMutation();

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const [lender, setLender] = useState('');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInfo._id)
    // console.log(userInfo)
    if (!userInfo) {
      toast.error('User information is not available');
      return;
    }
    try{
      await addLoanMutation({ userId, lender, amount, startDate, duration, interestRate, category, description }).unwrap();
      setLender('');
      setAmount('');
      setStartDate('');
      setDuration('');
      setInterestRate('');
      setCategory('');
      setDescription('');
      refetch();
    }catch(err){
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
  };

  const handleDeleteSubmit = async (id) => {
    try {
      await deleteLoanMutation(id).unwrap();
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
      await updateLoanMutation({id: updateId, lender, amount, startDate, duration, interestRate, category, description }).unwrap();
      setShowUpdateForm(false);
      setUpdateId(null);
      setLender('');
      setAmount('');
      setStartDate('');
      setDuration('');
      setInterestRate('');
      setCategory('');
      setDescription('');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
      console.error(err);
    }
  }

  useEffect(() => {
    console.log('IncomeTracking component rendered');
    if(!userInfo.isMember){
      toast.success('💡 Pro Tip: Upgrade your account today to customize your loan categories');
    }
  }, []);

  return (
    <>
    {isLoading ? <Loader /> 
    : isError ? <h2>Failed to fetch Loans</h2> 
    : (
    <>
      <div className='text-center'>
        <h1>Track your loans like a Pro!</h1>
        <h4>Your recorded loans:</h4>
      </div>
      <Row>
        <Col md="1"></Col>
        <Col md="12">

          {/* Table displaying Loans */}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Lender</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>Duration</th>
                <th>Interest Rate</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loan.map((item, index) =>(
                <tr key={index}>
                  <td>{item.lender}</td>
                  <td>$ {item.amount}</td>
                  <td>{new Date(item.startDate).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})}</td>
                  <td>{item.duration} months</td>
                  <td>{item.interestRate}%</td>
                  <td>{item.category}</td>
                  <td>{item.description}</td>
                  <td>
                    <div className='d-flex justify-content-around'>
                      <Button variant='info' onClick={() => handleUpdate(item._id)}>Update</Button>
                      <Button variant='danger' onClick={() => handleDelete(item._id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {loadingDeleteLoan && <Loader />}
            </tbody>
          </Table>

          {/* Form to allow for updating existing Loans */}
          {showUpdateForm && (<>
            <div className='update-form'>
              <h2>Update Loan</h2>
              <Form onSubmit={handleUpdateSubmit}>

              <Form.Group controlId='lender' className='my-2'>
                  <Form.Label>Lender</Form.Label>
                  <Form.Control 
                    type='text'
                    placeholder='Enter Lender'
                    value={lender}
                    onChange={(e) => setLender(e.target.value)} 
                    required 
                    maxLength='50'
                  ></Form.Control>
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

                <Form.Group controlId='startDate' className='my-2'>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type='date' value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} 
                    placeholder='Enter the start Date' required
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='duration' className='my-2'>
                  <Form.Label>Duration</Form.Label>
                  <Form.Control 
                    type='number'
                    placeholder='How many months?'
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))} 
                    required 
                    step='1'
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='interestRate' className='my-2'>
                  <Form.Label>Interest Rate</Form.Label>
                  <Form.Control 
                    type='number'
                    placeholder='Enter the interest rate as a %'
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.round(Number(e.target.value) * 10000) / 10000)} 
                    required 
                    step='0.0001'
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
                      <option value='Option 1'>Car</option>
                      <option value='Option 2'>Home</option>
                      <option value='Option 3'>Student</option>
                      {/* Add more options as needed */}
                  </Form.Control>
                )}
              </Form.Group>

              <Form.Group controlId='description' className='my-2'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    type='text'
                    placeholder='Enter a brief description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    maxLength='100'
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' disabled={isUserInfoLoading}>
                  Update
                </Button>
                {loadingUpdateLoan && <Loader />}
              </Form>
            </div>
          </>)}
        </Col>


        {/* Form to allow the user to enter new Loans */}
        {userInfo.isMember || loan.length < 3 ? (
          <>
          <div className='text-center'>
          <h1>New Loan? 🏦</h1>
        </div>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId='lender' className='my-2'>
                  <Form.Label>Lender</Form.Label>
                  <Form.Control 
                    type='text'
                    placeholder='Enter Lender'
                    value={lender}
                    onChange={(e) => setLender(e.target.value)} 
                    required 
                    maxLength='50'
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='amount' className='my-2'>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control 
                    type='number'
                    placeholder='Enter Total $ Amount'
                    value={amount}
                    onChange={(e) => setAmount(Math.round(Number(e.target.value) * 100) / 100)} 
                    required 
                    step='0.01'
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='startDate' className='my-2'>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type='date' value={startDate}
                    onChange={(e) => setStartDate(e.target.value)} 
                    placeholder='Enter the start Date' required
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='duration' className='my-2'>
                  <Form.Label>Duration</Form.Label>
                  <Form.Control 
                    type='number'
                    placeholder='How many months?'
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))} 
                    required 
                    step='1'
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='interestRate' className='my-2'>
                  <Form.Label>Interest Rate</Form.Label>
                  <Form.Control 
                    type='number'
                    placeholder='Enter the interest rate as a %'
                    value={interestRate}
                    onChange={(e) => setInterestRate(Math.round(Number(e.target.value) * 10000) / 10000)} 
                    required 
                    step='0.0001'
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
                      <option value='Option 1'>Car</option>
                      <option value='Option 2'>Home</option>
                      <option value='Option 3'>Student</option>
                      {/* Add more options as needed */}
                  </Form.Control>
                )}
              </Form.Group>

              <Form.Group controlId='description' className='my-2'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    type='text'
                    placeholder='Enter a brief description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                    maxLength='100'
                  ></Form.Control>
                </Form.Group>
            
            <Button type='submit' disabled={isUserInfoLoading}>
              Submit
            </Button>
            {loadingAddLoan && <Loader />}
        </Form>
        </>
        ) : (
          <h2>Upgrade to a member to add more Loans</h2>
        )}
        <Col md="1"></Col>
      </Row>
    </>
    )}
    </>
  )
}

export default LoanTracking