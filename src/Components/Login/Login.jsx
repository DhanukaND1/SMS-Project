import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='cont'>
      
      <form action="">
        <h2>Login</h2>
        <label htmlFor="">Username</label>
        <input type="text" required autoFocus/>
        <label htmlFor="">Password</label>
        <input type="password" required />
        <button>Login</button>
        <h4>Don't Have An Account?<Link to="/Role" className='link'>Sign Up</Link></h4>
      </form>
    </div>
  )
}

export default Login