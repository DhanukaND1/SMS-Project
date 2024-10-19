import React, {useState} from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Login = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error,setError] = useState({email:'',pass:''});
  const [formData,setFormData] = useState({
    role:'',
    mail:'',
    pass:''
  });

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleCheck = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
      
    });
    setError({});

        if(name === 'mail'){

          const start = value.indexOf('@')+1;
          const end = value.indexOf('.');
          const domain = value.substring(start, end);
          console.log(domain);
        
        if (['at', 'ict', 'iat', 'et'].includes(domain)) {
          setFormData(prev => ({ ...prev, role: 'Mentor'}));
        }else {
          setFormData(prev => ({ ...prev, role: 'Student'}));
      }
        }
        
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/login",{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if(data.success){

        if(formData.role == 'Student'){
          navigate('/student-dashboard');
        }

        else if(formData.role == 'Mentor'){
          navigate('/mentor-dashboard');
        }
        
        setFormData({
          role:'',
          mail:'',
          pass:''
        });

        setError({ mail: '', pass:'' });
  
      }else{
        if(data.message.includes('Email not found')){
          console.log(data.message)
          setError(prevState => ({ ...prevState, email: data.message }));
        }
        if(data.message.includes('Password not matched')){
          console.log(data.message)
          setError(prevState => ({ ...prevState, pass: data.message }));
        }
      }
    } catch (error) {
      toast.error('Error occurred while loging in. Please try again later.');
      console.error('Error:', error);
    }
  };



  return (
    <div className='cont'>
      
      <form action="" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>

        <div className="input-wrapper">
        <label htmlFor="">Email</label>
        <i className="fa-solid fa-user"></i>
        <input type="email" name='mail' className={ error.email ? 'error-state': ''}  value={formData.mail} onChange={handleCheck} required autoFocus/>
        </div>
        <span className="error" style={{height:'1rem'}}>{error.email}</span>

        <div className="input-wrapper">
        <label htmlFor="">Password</label>
        <i className="fa-solid fa-lock"></i>
        
        <div className="eye-wrapper">
        <span className="icon" onClick={togglePasswordVisibility}>
            <i className={`fa-solid ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </span>
        </div>

        <input type={passwordVisible ? 'text' : 'password'} name='pass' className={ error.pass ? 'error-state': ''} value={formData.pass} onChange={handleCheck} required />
        </div>

        <span className="error" style={{height:'1rem'}}>{error.pass}</span>
        <Link to="/forgot-password" className='forgot'><h4>Forgot Password?</h4></Link>
        <div className="btn-center">
        <button type='submit'>Login</button>
        <h4>Don't Have An Account?<Link to="/role" className='link'>Sign Up</Link></h4>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login