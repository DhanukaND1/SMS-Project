import React from 'react'
import './ForgotPassword.css'
import { Link } from 'react-router-dom'




const ForgotPassword = () => {
  return (

    <div className='fpcont'>
      
      <form action="">
        <h2>Forgot Password</h2>
        <Link className='xbtn' to="/Login"><i className="fa-solid fa-xmark"></i></Link>

        <div className="envelope-wrapper">
        <label htmlFor="">Email</label>
        <i className="fa-solid fa-envelope"></i>
        <input type="email" required autoFocus placeholder='enter your university mail'/>
        </div>
        <span className='error'></span>

        <div className="fpbtn">
        <button className='fpbtn'>Send Mail</button>
        </div>
      </form>
    </div>
    
    
    
  )
}

export default ForgotPassword