import React, {useState} from 'react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Login = () => {
  const [mail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // Loading state for UX
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading state
    setError(''); // Clear previous errors
    try {
      const result = await axios.post(
        'http://localhost:5001/api/login',
        { mail, password },
        { withCredentials: true }
      );

      if (result.data.message === 'Success') {
        const role = result.data.role;
        if (role === 'mentor') {
          navigate("/mentor-dashboard");
        }else if(role === 'student'){
          navigate("/student-dashboard");
        }
      } else {
        setError('Login failed: User does not exist' + result.data.error);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while logging in. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };


  return (
    <div className='cont'>
      
      <form action="" onSubmit={handleLogin}>
        <h2>Login</h2>
        <Link className='xbtn' to="/"><i className="fa-solid fa-xmark"></i></Link>

        <label htmlFor='email'>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={mail}
            type='email'
            id='email'
            required
            autoFocus
          />
          
          <label htmlFor='password'>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type='password'
            id='password'
            required
          />

        <span className="error" style={{height:'1rem'}}>{error.pass}</span>
        <Link to="/forgot-password" className='forgot'><h4>Forgot Password?</h4></Link>
        <div className="btn-center">
        <button type='submit' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        <h4>Don't Have An Account?<Link to="/role" className='link'>Sign Up</Link></h4>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default Login