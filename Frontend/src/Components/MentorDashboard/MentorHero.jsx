import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from './Modal.jsx';
import './Mentor.css'
import img1 from '../../assets/1.webp';
import { useLocation } from 'react-router-dom';

function MentorHero() {
  const location = useLocation();
  const mentorName = location.state?.name ; // Fetch mentor's name from state
  const [students, setStudents] = useState([]); // Store students list
  
  // Debug: check the location state being passed
  useEffect(() => {
    console.log("Location state:", location.state);
  }, [location.state]);

  //Function to fetch students based on selected batch year
  

  //Function to close the modal
  const closeModal = () => {
    setIsModalopen(false);
  }

  return (
    <div className='dashboard-container'>
      {/* Sidebar */}
      <aside className='sidebar'>
        <div className='sidebar-header'>
          <img src={img1} alt='pro' className='profile-pic' />
          <h2>{mentorName}</h2>
          <span>Mentor</span>
        </div>
        <nav className='nav-menu'>
          <ul>
            <li><a href='#'>Dashboard</a></li>
            <li><a href="#">Messages</a><span className="notification">4</span></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="#">Info Sessions</a></li>
          </ul>
        </nav>
      </aside>

      
      <div className="mentorhero-container">
        <section className="mentor-welcome">
          <p className="mentor-greeting">
            Welcome Back<br />
            <span className="mentor-name">{mentorName}</span>
          </p>
          <button className="messages-button">Check Messages</button>
        </section>

        <section className="student-list">
          <h2>Student List of Mentoring</h2>
          <div className="batches">
            {['19/20', '20/21', '21/22', '22/23'].map((batch) => (
              <div className="batch" key={batch}>
                <h3>{batch} Batch</h3>
                <button className="student-button" onClick={() => fetchStudents(batch)}>
                  Check Students List
                </button>
              </div>
            ))}
          </div>
        </section>

        

        {/* Recommendations */}
        <section className='recommendations'>
          <h2>Your Recommendations</h2>
          <div className='recommendation-list'>
            <div className='recommendation-item'>
              <p>Books</p>
            </div>
            <div className="recommendation-item">
              <p>Videos</p>
            </div>
            <div className="recommendation-item">
              <p>Courses</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MentorHero;
