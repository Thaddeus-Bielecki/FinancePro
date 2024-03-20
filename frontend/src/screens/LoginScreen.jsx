import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const LoginScreen = () => {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (email && password) {
      console.log('User is already logged in');
    }
  }, [email, password]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post('/api/users/login', {
        email,
        password
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  return (
    <div>
    <h1>Welcome to the Login Screen for FinancePro!</h1>
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
    
    {user && <p>Logged in as: {user.username}</p>}
    </div>
  )
}

export default LoginScreen