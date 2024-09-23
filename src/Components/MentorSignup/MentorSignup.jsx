import React from 'react'
import './MentorSignup.css'
import { useState } from 'react'
import { Link } from 'react-router-dom';


const MentorSignup = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const [errors, setErrors] = useState({email: ''} );
  const validate = (event) => {

    event.preventDefault();
    const mail = event.target.mail.value;
    const pass = event.target.pass.value;
    const pass1 = event.target.pass1.value;
    const phone = event.target.phone.value;


    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const validphone = /[0-9]{10}/.test(phone);
  
    const endmail = '.cmb.ac.lk';
    const mailPattern = new RegExp(`^[a-zA-Z]+@(iat|ict|et|at)${endmail}$`);
  
    let emailError = '';
    let passError = '';
    let pass1Error = "";
    let phoneError = '';

    if (!mailPattern.test(mail)) {
      emailError = "Please enter a valid email";
    }
    if(pass.length < 8){
      passError = "Password must be at least 8 characters long.";
    }
    else if(!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar){
      passError = "Password must contain an uppercase, lowercase, a digit, and a special character.";
    }
    if(pass1 != pass){
      pass1Error = "Passwords do not match.";
    }
    if(!validphone){
      phoneError = 'Please enter a valid phone number';
    }
  
    setErrors({email: emailError, pass:passError, pass1:pass1Error, phone:phoneError });
  
    if (emailError || passError || pass1Error || phoneError) {
      return false;
    }
  
    return true;
  };
  
  const handleSubmit = (event) => {
    if (!validate(event)) {
      event.preventDefault();
    }
  };
  
  return (
    <div className='container1'>
      <form action="" id='frm' className='myfrm' onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>
        <label htmlFor="">Mentor Id</label>
        <input type="text" autoFocus required />
        <label htmlFor="">Full Name</label>
        <input type="text" required/>
        <label htmlFor="">Department</label>
        <select name="" id="">
          <option value="" selected disabled>Select Department</option>
          <option value="">IAT</option>
          <option value="">ICT</option>
          <option value="">AT</option>
          <option value="">ET</option>
          </select>
        <label htmlFor="">Email</label>
        <input type="text" name="mail" id='mail' required/>
        <span className="error">{errors.email}</span>
        <label htmlFor="">Contact Number</label>
        <input type="tel" required name='phone'/>
        <span className="error">{errors.phone}</span>

        <label htmlFor="">Create Username</label>
        <input type="text" required/>

        <label>Create Password</label>
        <div className="password-field">
          <input type={passwordVisible ? 'text' : 'password'} id='pass' name='pass' required />
          <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error'>{errors.pass}</span>

        <label>Confirm Password</label>
        <div className="password-field">
          <input type={passwordVisible1 ? 'text' : 'password'} id='pass1' name='pass1' required />
          <span className="icon" onClick={togglePasswordVisibility1}>
            <i className={`fa-solid ${passwordVisible1 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error'>{errors.pass1}</span>

        <button>Sign Up</button>
        <div className="cover">
        <h4>Already have an account? <Link to="/Login" className='link'>Login</Link></h4>
        
        </div>
        
      </form>
    </div>
  )
};

export default MentorSignup