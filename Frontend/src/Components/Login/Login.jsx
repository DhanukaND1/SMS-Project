import React, {useState} from 'react'
import './Login.css'
import { Link } from 'react-router-dom'

const Login = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [role,setRole] = useState('');
  const [error,setError] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCheck = (e) => {
    setRole(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!role){
      setError("Please select a role.")
      return;
    }
  };

  return (
    <div className='cont'>
      
      <form action="" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>
        <label htmlFor="">Select your role</label>

        <div className='role-wrapper'>
          <input type="radio" name='role' value= "Student" onChange={handleCheck} />Student
          <input type="radio" name='role' value= "Mentor" onChange={handleCheck} />Mentor
        </div>
        <span className='error'>{error}</span>

        <div className="input-wrapper">
        <label htmlFor="">Username</label>
        <i className="fa-solid fa-user"></i>
        <input type="text" required autoFocus/>
        </div>

        <div className="input-wrapper">
        <label htmlFor="">Password</label>
        <i className="fa-solid fa-lock"></i>
        
        <div className="eye-wrapper">
        <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>

        <input type={passwordVisible ? 'text' : 'password'} required />
        </div>

        <div className="btn-center">
        <button>Login</button>
        <h4>Don't Have An Account?<Link to="/Role" className='link'>Sign Up</Link></h4>
        <Link to="/ForgotPassword"><h4>Forgot Password?</h4></Link>
        </div>
      </form>
    </div>
  )
}

export default Login