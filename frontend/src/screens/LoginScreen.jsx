import React from 'react'
import { useState } from 'react'

const LoginScreen = () => {
  const [user, setUser] = useState(null)

  const handleLogin = () => {
    setUser({
      username: 'user1',
      email: ''
    })
  }

  return (
    <div>
    <h1>Welcome to the Login Screen for FinancePro!</h1>
    <form>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </form>
    
    {user && <p>Logged in as: {user.username}</p>}
    </div>
  )
}

export default LoginScreen