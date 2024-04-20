// import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
// import axios from 'axios'
// import ForgotPassword from '../screens/ForgotPasswordScreen'
import { useForgotPasswordMutation } from '../slices/usersApiSlice'

const ForgotPasswordScreen = () => {
  // const [user, setUser] = useState(null) //
  const [email, setEmail] = useState('')

  const [forgotPassword, {isLoading: forgotPasswordLoading} ]= useForgotPasswordMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if(userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate])


  const submitHandler = async (e) => {
    e.preventDefault()
    try{
      await forgotPassword({ email }).unwrap();
      // const res = await login({ email, password}).unwrap();
      // dispatch(setCredentials({...res, }));
      alert('Email sent to reset password')
      navigate(redirect);
    } catch(err){
      toast.error(err?.data?.message || err.error)
    }
  }

  return (

    <FormContainer>
      <h1>Forgot Password</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-2' disabled={ isLoading }>
          Send Email
        </Button>

        { isLoading && <Loader /> }
      </Form>

      <Row className='py-3'>
        <Col>
          Remember Your Password? <Link to={redirect ? `/register?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default ForgotPasswordScreen