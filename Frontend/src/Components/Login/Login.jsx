import React, { useState } from 'react';
import { Paper } from '@mui/material'; // Assuming you're using Material UI for styling
import './Login.css'; // Custom CSS for additional styling
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
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
        'http://localhost:3001/login',
        { email, password },
        { withCredentials: true }
      );

      if (result.data.message === 'Success') {
        const role = result.data.role;
        if (role === 'mentor') {
          navigate("/Mentordash");
        }else if(role === 'student'){
          navigate("/Studentdash");
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
      <Paper elevation={3} className='paper'>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p className="error">{error}</p>} {/* Display error if exists */}

          <label htmlFor='email'>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
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

          <button type='submit' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <h4>
            Don't Have An Account? <Link to='/Role' className='link'>Sign Up</Link>
          </h4>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
