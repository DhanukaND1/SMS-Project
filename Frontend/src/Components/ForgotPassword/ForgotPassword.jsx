import React, {useState} from 'react'
import './ForgotPassword.css'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {

const [mail, setMail] = useState('');

const handleChange = (e) => {
   setMail(e.target.value);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    
    const response = await fetch('http://localhost/api/forgot-password',{
      method: "POST",
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({email:mail}),
    });

    const data = await response.json();
    if(data.success){
      alert("Mail has been sent, please go and check your mailbox");
      setMail("");
    }
  } catch (error) {
    alert('Error occurred while sending mail. Please try again later.');
    console.error('Error:', error);
  }
};

  return (

    <div className='fpcont'>
      
      <form action="" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <Link className='xbtn' to="/Login"><i className="fa-solid fa-xmark"></i></Link>

        <div className="envelope-wrapper">
        <label htmlFor="">Email</label>
        <i className="fa-solid fa-envelope"></i>
        <input type="email" required autoFocus placeholder='enter your university mail' value={mail} onChange={handleChange}/>
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