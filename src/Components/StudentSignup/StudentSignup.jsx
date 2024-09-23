import React, { useState } from 'react';
import './StudentSignup.css';
import { Link } from 'react-router-dom';

const mentor = {
  "IAT": ["Lecturer A1", "Lecturer A2", "Lecturer A3", "Lecturer A4"],
  "ICT": ["Lecturer B1", "Lecturer B2", "Lecturer B3", "Lecturer B4"],
  "AT": ["Lecturer C1", "Lecturer C2", "Lecturer C3", "Lecturer C4"],
  "ET": ["Lecturer D1", "Lecturer D2", "Lecturer D3", "Lecturer D4"],
};

const StudentSignup = () => {
  const [department, setDepartment] = useState('');
  const [mentorList, setMentorList] = useState([]);
  const [errors, setErrors] = useState({ id: '', email: '', pass: '', pass1: '' });

  const handleDepartmentChange = (event) => {
    const selectedDep = event.target.value;
    setDepartment(selectedDep);
    setMentorList(mentor[selectedDep] || []);
  };

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const validate = (event) => {
    event.preventDefault();
    const id = event.target.sid.value;
    const mail = event.target.mail.value;
    const pass = event.target.pass.value;
    const pass1 = event.target.pass1.value;

    const idPattern = /^20\d{2}t\d{5}$/;
    const endmail = 'stu.cmb.ac.lk';
    const mailPattern = new RegExp(`^${id}@${endmail}$`);
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    let idError = '';
    let emailError = '';
    let passError = '';
    let pass1Error = '';

    if (!idPattern.test(id)) {
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

    if (pass1 !== pass) {
      pass1Error = 'Passwords do not match.';
    }

    setErrors({ id: idError, email: emailError, pass: passError, pass1: pass1Error });

    if (idError || emailError || passError || pass1Error) {
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
    <div className='container2'>
      <form className="myform" id="myForm" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>
        <label htmlFor="sid">Student ID</label>
        <input type="text" id="sid" name="sid" placeholder="2022t01533" required autoFocus />
        <span className="error">{errors.id}</span>

        <label htmlFor="sname">Full Name</label>
        <input type="text" id="sname" name="sname" placeholder="H.W.S.M Herath" required />

        <label htmlFor="mail">Student Mail</label>
        <input type="text" id="mail" name="mail" placeholder="2022t01533@stu.cmb.ac.lk" required />
        <span className="error">{errors.email}</span>

        <label htmlFor="year">Batch Year</label>
        <select id="year" name="year" required>
          <option value="" disabled selected>Select Batch Year</option>
          <option value="18/19">18/19</option>
          <option value="19/20">19/20</option>
          <option value="20/21">20/21</option>
          <option value="21/22">21/22</option>
        </select>

        <label htmlFor="department">Department</label>
        <select id="department" name="department" value={department} onChange={handleDepartmentChange} required>
          <option value="" disabled selected>Select Department</option>
          <option value="IAT">IAT</option>
          <option value="ICT">ICT</option>
          <option value="AT">AT</option>
          <option value="ET">ET</option>
        </select>

        <label htmlFor="mentor">Mentor</label>
        <select id="mentor" name="mentor" required>
          <option value="" disabled selected>Select Mentor</option>
          {mentorList.map((mentorName) => (
            <option key={mentorName} value={mentorName}>{mentorName}</option>
          ))}
        </select>

        <label>Create Username</label>
        <input type="text" required />

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

        <button type="submit">SIGN UP</button>

        <div className='cover'>
          <h4>Already have an account? <Link to="/Login" className='link'>Login</Link> </h4>
        </div>
      </form>
    </div>
  );
}

export default StudentSignup;
