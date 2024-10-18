import React, { useState } from 'react';
import './MentorSignup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MentorSignup = () => {
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [contactnum, setContactnum] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({ email: '', pass: '', pass1: '', phone: '' });

  const validate = () => {
    let isValid = true;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const validPhone = /^[0-9]{10}$/.test(contactnum);

    const endMail = '.cmb.ac.lk';
    const mailPattern = new RegExp(`^[a-zA-Z]+@(iat|ict|et|at)${endMail}$`);

    let emailError = '';
    let passError = '';
    let pass1Error = '';
    let phoneError = '';

    if (!mailPattern.test(email)) {
      emailError = 'Please enter a valid email';
      isValid = false;
    }
    if (password.length < 8) {
      passError = 'Password must be at least 8 characters long.';
      isValid = false;
    } else if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      passError = 'Password must contain an uppercase, lowercase, digit, and special character.';
      isValid = false;
    }
    if (confirmPassword !== password) {
      pass1Error = 'Passwords do not match.';
      isValid = false;
    }
    if (!validPhone) {
      phoneError = 'Please enter a valid phone number.';
      isValid = false;
    }

    setErrors({ email: emailError, pass: passError, pass1: pass1Error, phone: phoneError });

    return isValid;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    axios.post("http://localhost:3001/Mentorsignup", { name, department, email, contactnum, username, password })
      .then(result => {
        if (result.status === 201) {
          console.log("User created successfully");
          navigate("/Login");
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          window.alert("Email already exists. Please use a different email");
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className='container1'>
      <form id='frm' className='myfrm' onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        
        <label>Full Name</label>
        <input onChange={(e) => setName(e.target.value)} type="text" required />

        <label>Department</label>
        <select onChange={(e) => setDepartment(e.target.value)} required>
          <option value="" disabled selected>Select Department</option>
          <option value="IAT">IAT</option>
          <option value="ICT">ICT</option>
          <option value="AT">AT</option>
          <option value="ET">ET</option>
        </select>

        <label>Email</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <span className="error">{errors.email}</span>

        <label>Contact Number</label>
        <input type="tel" value={contactnum} onChange={(e) => setContactnum(e.target.value)} required />
        <span className="error">{errors.phone}</span>

        <label>Create Username</label>
        <input onChange={(e) => setUsername(e.target.value)} type="text" required />

        <label>Create Password</label>
        <div className="password-field">
          <input type={passwordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error'>{errors.pass}</span>

        <label>Confirm Password</label>
        <div className="password-field">
          <input type={passwordVisible1 ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <span className="icon" onClick={togglePasswordVisibility1}>
            <i className={`fa-solid ${passwordVisible1 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error'>{errors.pass1}</span>

        <button type="submit">Sign Up</button>
        <div className="cover">
          <h4>Already have an account? <Link to="/Login" className='link'>Login</Link></h4>
        </div>
      </form>
    </div>
  );
};

export default MentorSignup;