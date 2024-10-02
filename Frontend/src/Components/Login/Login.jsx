import React, {useState} from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error,setError] = useState({role:'',user:''});
  const [formData,setFormData] = useState({
    role:'',
    user:'',
    pass:''
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCheck = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (e.target.name === 'role') {
      setError(prevState => ({ ...prevState, role: '' }));
    } else if (e.target.name === 'user') {
      setError(prevState => ({ ...prevState, user: '' }));
    }

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.role){
      setError(prevState => ({ ...prevState, role: 'Please select a role.' }));
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/login",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if(data.success){
        setFormData({
          role:'',
          user:'',
          pass:''
        });

        setError({ role: '', user: '' });
         
        if(formData.role === "Student"){
          navigate('/student-dashboard');
        }
        else if(formData.role === "Mentor"){
          navigate('/mentor-dashboard');
        }
      }else{
        setError(prevState => ({ ...prevState, user: data.message }));
      }
    } catch (error) {
      alert('Error occurred while loging in. Please try again later.');
      console.error('Error:', error);
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
        <span className='error'>{error.role}</span>

        <div className="input-wrapper">
        <label htmlFor="">Username</label>
        <i className="fa-solid fa-user"></i>
        <input type="text" name='user' value={formData.user} onChange={handleCheck} required autoFocus/>
        </div>

        <div className="input-wrapper">
        <label htmlFor="">Password</label>
        <i className="fa-solid fa-lock"></i>
        
        <div className="eye-wrapper">
        <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>

        <input type={passwordVisible ? 'text' : 'password'} name='pass' value={formData.pass} onChange={handleCheck} required />
        </div>

        <span className="error">{error.user}</span>

        <div className="btn-center">
        <button>Login</button>
        <h4>Don't Have An Account?<Link to="/role" className='link'>Sign Up</Link></h4>
        <Link to="/forgot-password"><h4>Forgot Password?</h4></Link>
        </div>
      </form>
    </div>
  )
}

export default Login