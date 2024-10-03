import React, {useState} from 'react'
import './ForgotPassword.css'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {

const [mail, setMail] = useState('');
const [error, setError] = useState('');

const handleChange = (e) => {
   setMail(e.target.value);
   setError('');
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    
    const response = await fetch('http://localhost:5001/api/forgot-password',{
      method: "POST",
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({mail}),
    });

    const data = await response.json();
    console.log(data.success);
    if(data.success){
      alert("Mail has been sent, please go and check your mailbox");
      setMail("");
    
    }else{
      setError('Email not found, Please enter a valid email.')
    }
  } catch (error) {
    alert('Error occurred while sending mail. Please try again later.');
    console.log('Error:', error);
  }
};

  return (

    <div className='fpcont'>
      
      <form action="" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <Link className='xbtn' to="/login"><i className="fa-solid fa-xmark"></i></Link>

        <div className="envelope-wrapper">
        <label htmlFor="">Email</label>
        <i className="fa-solid fa-envelope"></i>
        <input type="email" required autoFocus placeholder='enter your university mail' value={mail} onChange={handleChange}/>
        </div>
        <span className='error'>{error}</span>

        <div className="fpbtn">
        <button className='fpbtn'>Send Mail</button>
        </div>
      </form>
    </div>
    
    
    
  )
}

export default ForgotPassword