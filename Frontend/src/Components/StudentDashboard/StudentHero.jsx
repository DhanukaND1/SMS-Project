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
            <div className="studenthero-container">
                <section className="student-welcome home">
                    <p className="student-greeting">
                        Welcome Back<br />
                        <span className="student-name">{studentName}</span>
                    </p>
                    <button className="messages-button">Check Messages</button>
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
