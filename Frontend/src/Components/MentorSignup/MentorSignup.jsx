import React from 'react'
import './MentorSignup.css'
import { useState } from 'react'
import { Link } from 'react-router-dom';


const MentorSignup = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);
  const [formData, setFormData] = useState({
    mid: '',
    name: '',
    dept: '',
    mail: '',
    phone: '',
    user: '',
    pass: '',
    pass1: ''
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const [errors, setErrors] = useState({ email: '', user: '' });
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
    if (pass.length < 8) {
      passError = "Password must be at least 8 characters long.";
    } else if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      passError = "Password must contain an uppercase, lowercase, a digit, and a special character.";
    }
    if (pass1 !== pass) {
      pass1Error = "Passwords do not match.";
    }
    if (!validphone) {
      phoneError = 'Please enter a valid phone number';
    }

    setErrors({ email: emailError, pass: passError, pass1: pass1Error, phone: phoneError });

    if (emailError || passError || pass1Error || phoneError || errors.user) {
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const checkUserName = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, user: value }));

    if (value) {
      try {
        const response = await fetch('http://localhost:5000/api/check-user-mentor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: value }),
        });

        const data = await response.json();
        if (!data.success) {
          setErrors((prevErrors) => ({ ...prevErrors, user: data.message }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, user: '' }));
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate(event)) {
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/signupMentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert('Signup successful!');
        setFormData({
          mid: '',
          name: '',
          dept: '',
          mail: '',
          phone: '',
          user: '',
          pass: '',
          pass1: ''
        });
      } else {
        alert('Signup failed: ' + data.message);
      }
    } catch (error) {
      alert('Error occurred while signing up. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='container1'>
      <form action="" id='frm' className='myfrm' onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>
        <label htmlFor="mid">Mentor Id</label>
        <input type="text" id='mid' name='mid' value={formData.mid} onChange={handleChange} autoFocus required />
        <label htmlFor="name">Full Name</label>
        <input type="text" id='name' name='name' value={formData.name} onChange={handleChange} required />
        <label htmlFor="dept">Department</label>
        <select name="dept" id="dept" value={formData.dept} onChange={handleChange}>
          <option value="" selected disabled>Select Department</option>
          <option value="IAT">IAT</option>
          <option value="ICT">ICT</option>
          <option value="AT">AT</option>
          <option value="ET">ET</option>
        </select>
        <label htmlFor="email">Email</label>
        <input type="email" name="mail" id='mail' value={formData.mail} onChange={handleChange} required />
        <span className="error">{errors.email}</span>
        <label htmlFor="phone">Contact Number</label>
        <input type="tel" required name='phone' id='phone' value={formData.phone} onChange={handleChange} />
        <span className="error">{errors.phone}</span>

        <label htmlFor="user">Create Username</label>
        <input type="text" name='user' id='user' value={formData.user} onChange={handleChange} onInput={checkUserName} required />
        <span className="error">{errors.user}</span>
        <label>Create Password</label>
        <div className="password-field">
          <input type={passwordVisible ? 'text' : 'password'} id='pass' name='pass' value={formData.pass} onChange={handleChange} required />
          <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error'>{errors.pass}</span>

        <label>Confirm Password</label>
        <div className="password-field">
          <input type={passwordVisible1 ? 'text' : 'password'} id='pass1' name='pass1' value={formData.pass1} onChange={handleChange} required />
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
  );
};

export default MentorSignup;
