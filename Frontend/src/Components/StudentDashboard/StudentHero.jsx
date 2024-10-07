import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDash.css';
import img1 from '../../assets/1.webp';


function StudentHero() {
    const [studentName, setStudentName] = useState('');
    const [mentorName, setMentorName] = useState('');

    useEffect(() => {
        const fetchStudentName = async () => {
            try {
                const response = await axios.get('http://localhost:3001/dashboard', { withCredentials: true });
                setStudentName(response.data.name);
                setMentorName(response.data.mentor);
            } catch (error) {
                console.log('Error fetching student name:', error);
            }
        };
        fetchStudentName();
    }, []);

    return (
        <div className='dashboard-container'>
            {/* Sidebar */}
            <aside className='sidebar'>
                <div className='sidebar-header'>
                    <img src={img1} alt='pro' className='profile-pic' />
                    <h2>{studentName}</h2>
                    <span>Student</span>
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

            {/* Main content */}
            <div className='main-content'>
                {/* Welcome Message */}
                <section className='welcome-section'>
                    <h1>Welcome Back,<span className='highlight'>{studentName}</span></h1>
                    <p>Manage all the things from a single dashboard. See latest info sessions, recent conversations, and update your recommendations.</p>
                    {/* Display student's mentor name */}
                    <h3>Your Mentor : {mentorName}</h3>
                </section>

                {/* Ongoing Info Sessions */}
                <section className='info-sessions'>
                    <h2>Ongoing Info Sessions</h2>
                    <div className='sessions'>
                        <div className='session-card'>
                            <p>Typing: How to Increase Your Typing Speed</p>
                            <p className="date">1 Day Left</p>
                            <button className="attend-button">Attend</button>
                        </div>
                        <div className='session-card'>
                            <p>Typing: How to Increase Your Typing Speed</p>
                            <p className="date">1 Day Left</p>
                            <button className="attend-button">Attend</button>
                        </div>
                        <div className='session-card'>
                            <p>Typing: How to Increase Your Typing Speed</p>
                            <p className="date">1 Day Left</p>
                            <button className="attend-button">Attend</button>
                        </div>
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

export default StudentHero;
