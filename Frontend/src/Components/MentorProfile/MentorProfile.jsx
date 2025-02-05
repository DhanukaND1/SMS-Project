import React, {useState, useEffect} from 'react';
import profilePic from '../../assets/profilepic.png';
import axios from 'axios';
import './MentorProfile.css'
import { Link } from 'react-router-dom';

const MentorProfile = () => {

  const [mentorName, setMentorName] = useState();
  const [mentorData, setMentorData] = useState({});
  const [role, setRole] = useState();
  let dashboard_path;
  

  useEffect(() => {
    const fetchMentorName = async() => {
      try{
        const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
        setMentorName(response.data.mentor);
        setRole(response.data.role);
      
      } catch (error) {
        console.log('Error fetching mentor name:', error);
    }
    };
    fetchMentorName();
  }, []);
  
  useEffect(() => {

    if (!mentorName) return;
    const fetchMentorData = async() => {
      try{
        const response = await axios.get('http://localhost:5001/api/mentor-data', {
          params:{mentor: mentorName}
        });
        setMentorData(response.data);
      } catch (error) {
        console.log('Error fetching mentor data:', error);
    }
    };
    fetchMentorData();
  }, [mentorName]);

  if(role === 'Student'){
    dashboard_path = '/student-dashboard'
  }else if(role === 'Mentor'){
    dashboard_path = '/mentor-dashboard'
  }

  return (
    <div className='cont-cent'>
      <form action="">
          <div className='stud-prof'>
          <div className='edit-prof cent'>
            <h2>Mentor Information</h2>
          </div>
          
          <div className='prof-head cent'>
            <img src= {mentorData.image ? `http://localhost:5001/api${mentorData.image}` : profilePic} alt="Profile Picture" />
          </div>

          <div className="info-grid">
            
          <strong>Mentor Name</strong>
          <span>{mentorData.name}</span>

          <strong >Mentor Mail</strong>
          <span>{mentorData.email}</span>

          <strong >Department</strong>
          <span>{mentorData.dept}</span>

          <strong>Phone Number</strong>
          <span>{mentorData.phone}</span>

          </div>
          <Link to={dashboard_path}> <button className = 'go-dash'>Go to Dashboard</button> </Link>
          </div>
          </form>
    </div>
  )
}

export default MentorProfile
