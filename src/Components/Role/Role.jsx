import React, { useState } from 'react'
import './Role.css'
import { useNavigate } from 'react-router-dom';


  const Role = () => {
    const [roles, setRole] = useState('');
    const navigate = useNavigate();

    const handleSubmission = (e) => {
      e.preventDefault();

      if (roles === 'mentor') {
        navigate('/MentorSignUp');
      } else if(roles === 'student') {
        navigate('/StudentSignUp');
      }
  };
  
  return (
    <div className='role1'>
      <form onSubmit={handleSubmission}>
        <h3 className='title'>Role</h3>
        <h3>Select Your Role</h3>
        <input type="radio" value="mentor" name='g1' checked={roles === 'mentor'} onChange={(e)=> setRole(e.target.value)}/>
        <label htmlFor="">Mentor</label><br />
        <input type="radio"value="student" name='g1' checked={roles === 'student'} onChange={(e)=> setRole(e.target.value)}/>
        <label>Student</label><br />
        <button>Submit</button>
      </form>
    </div>
  )

};
export default Role