import React, { useState}  from 'react'
import { Link } from 'react-router-dom'
import './ResetPassword.css'

const ResetPassword = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [error, setError] = useState({pass:'', repass:''});
  const [formData, setFormData] = useState({pass:'', repass:''})

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };
  const handleChange = (e) => {
    setFormData({ ...formData,[e.target.name]:e.target.value });

  };
  const validation = (event) => {
    event.preventDefault();
    const {pass, repass} = formData;

    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    let passError = '';
    let pass1Error = '';

    if(pass.length < 8){
      passError = 'Password must be at least 8 characters long.';
    }
    else if(!hasDigit || !hasLowercase || !hasUppercase || !hasSpecialChar){
      passError = 'Password must contain an uppercase, lowercase, a digit, and a special character.';
    }
    if(repass !== pass){
      pass1Error = 'Passwords do not match.'
    }
    setError({pass:passError, repass:pass1Error});
    return !(passError || pass1Error)

  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validation(e)){
      return;
    }
  }

  return (
    <div className='repass'>
      <form action="" onSubmit={handleSubmit}>
        <h2>Reset Password</h2>

        <div className="repass-wrapper">
        <div className='repass-center'>
          <label htmlFor="">Enter new password </label>
          <div className="lock-icon">
          <i className="fa-solid fa-lock lock"></i>
          </div>
         

          <div className="eye-wrapper">
        <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>

          <input type={passwordVisible ? 'text' : 'password'} name='pass' value={formData.pass} onChange={handleChange} autoFocus required />
          <span className="error">{error.pass}</span>
          </div>

          <div className='repass-center'>
          <label htmlFor="">Re-enter new password</label>
          <div className="lock-icon">
          <i className="fa-solid fa-lock lock"></i>
          </div>
          

          <div className="eye-wrapper">
        <span className="icon" onClick={togglePasswordVisibility1}>
            <i className={`fa-solid ${passwordVisible1 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>

          <input type= {passwordVisible1 ? 'text' : 'password'} name='repass' value={formData.repass} onChange={handleChange} required />
          <span className="error">{error.repass}</span>
        </div>
        </div>
        <div className="repass-btn">
        <button>Reset Password</button>
        </div>
        
      </form>
    </div>
  )
}

export default ResetPassword