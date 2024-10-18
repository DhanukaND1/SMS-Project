import React, { useState } from 'react';
import './StudentSignup.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const mentor = {
  "IAT": ['Dr. Hansika Atapattu', 'Dr. Chathurika De Silva', 'Dr. Lakmini Jayasinghe', 'Dr. Ruwan Kalubowila', 'Dr. Udara Mutugala', 'Dr. Sanjaya Thilakerathne', 'Mr. Gihan Amarasinghe', 'Mr. L.M. Samaratunga', 'Mr. Supun Kariyawasam', 'Mr. U.V.H. Sameera'],
  "ICT": ['Dr. Rohan Samarasinghe', 'Ms. Chamindi Kavindya Samarasekara', 'Mr. Chathura Mahasen Bandara', 'Mrs. Nethmini Weerawarna'],
  "AT": ['Dr. Jayani Wewalwela', 'Dr. Aruna Kumara', 'Dr. Priyanga Kariyawasam', 'Dr. K.T. Ariyawansha', 'Mrs. G.W.A.S. Lakmini', 'Ms. Thilini Jayaprada', 'Prof. Kanchana Abeysekera'],
  "ET": ['Dr. Kosala Sirisena', 'Dr. Madhusha Sudasinghe', 'Dr. N.L. Ukwattage', 'Dr. Poorna Piyathilaka', 'Prof. Chamini Hemachandra', 'Prof. Ranjana Piyadasa', 'Prof. Sansfica Young'],
};

const StudentSignup = () => {
  const [mentorList, setMentorList] = useState([]);
  const [errors, setErrors] = useState({ id: '', email: '', pass: '', rePass: ''});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible1, setPasswordVisible1] = useState(false);

  const [formData, setFormData] = useState({
    sid: '',
    sname: '',
    mail: '',
    year: '',
    dept: '',
    mentor: '',
    pass: '',
    rePass: ''
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility1 = () => {
    setPasswordVisible1(!passwordVisible1);
  };

  const handleChange =  (e) => {

    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  
    if (name === 'dept') {
      setMentorList(mentor[value] || []);
    }
  };
  
  
  const checkMail = async (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({ ...prevData, mail: value }));
    

    if (value) {
      try {
        const response = await fetch('http://localhost:5001/api/check-user-student', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mail: value }),
        });

        const data = await response.json();
        if (!data.success) { 
          setErrors((prevErrors) => ({ ...prevErrors, email: data.message }));
          console.log(emailErr)
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
      } catch (error) {
        console.error('Error checking mail:', error);
      }
    }
  };

  const validate = (event) => {

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

    let userid = mail.split("@")[0];

    if(userid != sid){
      emailError = 'Email does not match with given ID';
    }
    else if (!mailPattern.test(mail)) {
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

    return idError || emailError || passError || pass1Error
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (validate(event)) {
      return;
    }

    // console.log('Form Data being sent:', formData);

    try {
      const response = await fetch('http://localhost:5001/api/signupStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Signup successful!');
        setFormData({
          sid: '',
          sname: '',
          mail: '',
          year: '',
          dept: '',
          mentor: '',
          pass: '',
          rePass: ''
        });
      } else {
        toast.warn('Signup failed: ' + data.message);
      }
    } catch (error) {
      toast.error('Error occurred while signing up. Please try again later.');
      console.error('Error:', error);
    }
  };
  
  return (
    <div className='container2'>
      <form className="myform" id="myForm" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>

        <label htmlFor="sid">Student ID</label>
        <input type="text" id="sid" className={errors.id ? 'error-state' : ''} value={formData.sid} onChange={handleChange} name="sid" placeholder="2022t01533" required autoFocus />
        <span className="error" style={{height:'1rem',marginTop:'-5px'}}>{errors.id}</span>

        <label htmlFor="sname">Full Name</label>
        <input type="text" id="sname" value={formData.sname} onChange={handleChange} name="sname" placeholder="H.W.S.M Herath" required />

        <label htmlFor="mail">Student Mail</label>
        <input type="email" id="mail" className={errors.email ? 'error-state' : ''} value={formData.mail} onInput={checkMail} onChange={handleChange} name="mail" placeholder="2022t01533@stu.cmb.ac.lk" required />
        <span className="error" style={{height:'1rem',marginTop:'-5px'}}>{errors.email}</span>

        <label htmlFor="year">Batch Year</label>
        <select id="year" name="year" value={formData.year} onChange={handleChange} required>
          <option value="" disabled>Select Batch Year</option>
          <option value="19/20">19/20</option>
          <option value="20/21">20/21</option>
          <option value="21/22">21/22</option>
          <option value="22/23">22/23</option>
        </select>

        <label htmlFor="department">Department</label>
        <select id="department" 
         name="dept" value={formData.dept} onChange={handleChange} required >
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

        <label>Create Password</label>
        <div className="password-field">
          <input type={passwordVisible ? 'text' : 'password'} className={errors.pass ? 'error-state' : ''} id='pass' name='pass' value={formData.pass} onChange={handleChange} required />
          <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error' style={{height:'2rem',marginTop:'-5px'}}>{errors.pass}</span>

        <label>Confirm Password</label>
        <div className="password-field">
          <input type={passwordVisible1 ? 'text' : 'password'} className={errors.rePass ? 'error-state' : ''} id='rePass' name='rePass' value={formData.rePass} onChange={handleChange} required />
          <span className="icon" onClick={togglePasswordVisibility1}>
            <i className={`fa-solid ${passwordVisible1 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>
        <span className='error' style={{height:'1rem',marginTop:'-5px'}}>{errors.rePass}</span>

        <button type="submit" className="submit-btn" disabled = {errors.email === "Email already registered."} >Sign Up</button>
  

        <div className='cover'>
          <h4>Already have an account? <Link to="/login" className='link'>Login</Link> </h4>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default StudentSignup;
