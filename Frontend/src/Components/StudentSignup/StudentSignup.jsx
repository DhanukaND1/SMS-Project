import React, { useState, useEffect } from 'react';
import './StudentSignup.css';
import { Link } from 'react-router-dom';

const mentor = {
  "IAT": ["Lecturer A1", "Lecturer A2", "Lecturer A3", "Lecturer A4"],
  "ICT": ["Lecturer B1", "Lecturer B2", "Lecturer B3", "Lecturer B4"],
  "AT": ["Lecturer C1", "Lecturer C2", "Lecturer C3", "Lecturer C4"],
  "ET": ["Lecturer D1", "Lecturer D2", "Lecturer D3", "Lecturer D4"],
};

const StudentSignup = () => {
  const [mentorList, setMentorList] = useState([]);
  const [errors, setErrors] = useState({ id: '', email: '', pass: '', rePass: '', user: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const [formData, setFormData] = useState({
    sid: '',
    sname: '',
    mail: '',
    year: '',
    dept: '',
    mentor: '',
    user: '',
    pass: '',
    rePass: ''
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'dept') {
      setMentorList(mentor[e.target.value] || []);
    }
  };
  
  const checkUserName = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, user: value }));

    if (value) {
      try {
        const response = await fetch('http://localhost:5000/api/check-user-student', {
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

  const validate = (event) => {
    event.preventDefault();
    const { sid, mail, pass, rePass } = formData;
    const idPattern = /^20\d{2}t\d{5}$/;
    const endmail = 'stu.cmb.ac.lk';
    const mailPattern = new RegExp(`^${sid}@${endmail}$`);
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    let idError = '';
    let emailError = '';
    let passError = '';
    let pass1Error = '';

    if (!idPattern.test(sid)) {
      idError = 'Please enter a valid ID.';
    }

    if (!mailPattern.test(mail)) {
      emailError = 'Please enter a valid email.';
    }

    if (pass.length < 8) {
      passError = 'Password must be at least 8 characters long.';
    } else if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      passError = 'Password must contain an uppercase, lowercase, a digit, and a special character.';
    }

    if (rePass !== pass) {
      pass1Error = 'Passwords do not match.';
    }

    setErrors({ id: idError, email: emailError, pass: passError, rePass: pass1Error });

    return !(idError || emailError || passError || pass1Error || errors.user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate(event)) {
      return;
    }
    console.log('Errors state:', errors);
    if (errors.user) {
      alert('Please choose a different username.');
      return;
    }

    if (formData.user) {
      try {
        const response = await fetch('http://localhost:5000/api/check-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: formData.user }),
        });
  
        const data = await response.json();
        if (!data.success) {
          setErrors((prevErrors) => ({ ...prevErrors, user: data.message }));
          return;
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, user: '' }));
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    }

    console.log('Form Data being sent:', formData);

    try {
      const response = await fetch('http://localhost:5000/api/signupStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert('Signup successful!');
        setFormData({
          sid: '',
          sname: '',
          mail: '',
          year: '',
          dept: '',
          mentor: '',
          user: '',
          pass: '',
          rePass: ''
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
    <div className='container2'>
      <form className="myform" id="myForm" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>

        <label htmlFor="sid">Student ID</label>
        <input type="text" id="sid" value={formData.sid} onChange={handleChange} name="sid" placeholder="2022t01533" required autoFocus />
        <span className="error">{errors.id}</span>

        <label htmlFor="sname">Full Name</label>
        <input type="text" id="sname" value={formData.sname} onChange={handleChange} name="sname" placeholder="H.W.S.M Herath" required />

        <label htmlFor="mail">Student Mail</label>
        <input type="email" id="mail" value={formData.mail} onChange={handleChange} name="mail" placeholder="2022t01533@stu.cmb.ac.lk" required />
        <span className="error">{errors.email}</span>

        <label htmlFor="year">Batch Year</label>
        <select id="year" name="year" value={formData.year} onChange={handleChange} required>
          <option value="" disabled>Select Batch Year</option>
          <option value="18/19">18/19</option>
          <option value="19/20">19/20</option>
          <option value="20/21">20/21</option>
          <option value="21/22">21/22</option>
        </select>

        <label htmlFor="department">Department</label>
        <select id="department" name="dept" value={formData.dept} onChange={handleChange} required>
          <option value="" disabled>Select Department</option>
          <option value="IAT">IAT</option>
          <option value="ICT">ICT</option>
          <option value="AT">AT</option>
          <option value="ET">ET</option>
        </select>

        <label htmlFor="mentor">Mentor</label>
        <select id="mentor" name="mentor" value={formData.mentor} onChange={handleChange} required>
          <option value="" disabled>Select Mentor</option>
          {mentorList.map((mentorName) => (
            <option key={mentorName} value={mentorName}>{mentorName}</option>
          ))}
        </select>

        <label>Create Username</label>
        <input type="text" name="user" value={formData.user} onInput={checkUserName} onChange={handleChange} required />
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
          <input type={passwordVisible1 ? 'text' : 'password'} id='rePass' name='rePass' value={formData.rePass} onChange={handleChange} required />
          <span className="icon" onClick={togglePasswordVisibility1}>
            <i className={`fa-solid ${passwordVisible1 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error'>{errors.rePass}</span>

        <button type="submit" className="submit-btn">Sign Up</button>

        <div className='cover'>
          <h4>Already have an account? <Link to="/login" className='link'>Login</Link> </h4>
        </div>
      </form>
    </div>
  );
};

export default StudentSignup;
