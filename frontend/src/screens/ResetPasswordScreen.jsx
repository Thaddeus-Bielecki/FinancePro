// import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { toast } from 'react-toastify'
import { useResetPasswordMutation } from '../slices/usersApiSlice'
// import axios from 'axios'

const ResetPasswordScreen = () => {
  // const [user, setUser] = useState(null) //

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  
  // const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  const token = sp.get('token');
  console.log('Token:', token);

  // useEffect(() => {
  //   if(userInfo) {
  //     navigate(redirect);
  //   }
  // }, [userInfo, redirect, navigate])


  const submitHandler = async (e) => {
    e.preventDefault()
    if(password !== confirmPassword){
      toast.error('Passwords do not match')
      return
    } else {
      const data = { password, token };
      console.log('Data passed to resetPassword:', data);
      try{
        const res = await resetPassword({ password, token }).unwrap();
        navigate(redirect);
      } catch(err){
        toast.error(err?.data?.message || err.error)
      }
    }
  }

  return (

    <FormContainer>
      <h1>Forgot Password</h1>

      <Form onSubmit={submitHandler}>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}>
          </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-2' disabled={ isLoading }>
          Update Password
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

export default ResetPasswordScreen