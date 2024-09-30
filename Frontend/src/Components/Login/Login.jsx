import React from 'react'
import './Login.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className='cont'>
      
      <form action="">
        <h2>Login</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>

        <div className="input-wrapper">
        <label htmlFor="">Username</label>
        <i className="fa-solid fa-user"></i>
        <input type="text" required autoFocus/>
        </div>

        <div className="input-wrapper">
        <label htmlFor="">Password</label>
        <i className="fa-solid fa-lock"></i>
        <input type="password" required />
        </div>

        <button>Login</button>
        <h4>Don't Have An Account?<Link to="/Role" className='link'>Sign Up</Link></h4>
      </form>
    </div>
  )
}

export default Login