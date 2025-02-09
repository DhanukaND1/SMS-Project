import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './StudentDash.css';
// import session from 'express-session';

function StudentHero() {
    const [studentName, setStudentName] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [batchyear, setBatchYear] = useState('');
    const [resources, setResources] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [resourceType, setResourceType] = useState('');
    const [sessions, setSessions] = useState([]);

    // Fetch Student Name
    useEffect(() => {
        const fetchStudentName = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
                setStudentName(response.data.name);
                setMentorName(response.data.mentor);
                setBatchYear(response.data.batchyear);
                console.log('Batch Year fetched:', response.data.batchyear); // Log the batch year
            } catch (error) {
                console.log('Error fetching student name:', error);
            }
        };
        fetchStudentName();
    }, []);

    let setIcon;

    if (resourceType === 'pdf') {
        setIcon = 'bx bxs-file-pdf';
    } else if (resourceType === 'video') {
        setIcon = 'bx bxs-videos'
    } else if (resourceType === 'audio') {
        setIcon = 'bx bxs-music';
    }

    // Fetch Resources
    const fetchResources = async (type, batchyear) => {
        try {
            console.log('Fetching resources with batchYear:', batchyear, 'and type:', type);
            const response = await axios.get('http://localhost:5001/api/resourcesdash', {
                params: { batchyear: batchyear, type: type }, // Ensure single values
                withCredentials: true,
            });
            console.log('Resources fetched:', response.data);
            setResources(response.data);
            setResourceType(type);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching resources:', error.response.data, error.message);
            setShowModal(true);
            setResourceType(type);
            setResources([]);

        }
    };

    //Fetch sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/ongoing-sessions', {
                    params: { batchyear },
                    withCredentials: true,
                });

                const updatedSessions = response.data.map(session => {
                    const sessionDate = new Date(session.Date);
                    const today = new Date();
                    const timeDiff = sessionDate - today;
                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
                    return { ...session, daysLeft };
                });

                setSessions(updatedSessions);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        if (batchyear) fetchSessions();
    }, [batchyear]);


    return (
        <div className='dashboard-container'>
            <div className="studenthero-container">
                <section className="student-welcome home">
                    <p className="student-greeting">
                        Welcome Back<br />
                        <span className="student-name">{studentName}</span>
                        <br />
                        <h4>Mentor Name : <Link to='/mentor-profile' className='mentor-prof'><span className='yourmentor-name'>{mentorName}</span></Link> </h4>

                    </p>
                    <button className="messages-button">Check Messages</button>
                </section>

                <hr />

                {/* Ongoing Info Sessions */}
                <section className='info-sessions'>
                    <h2>Ongoing Info Sessions</h2>
                    <div className='sessions'>
                        {sessions.length > 0 ? (
                            sessions.map((session, index) => (
                                <div className='session-card' key={index}>
                                    <p>{session.Index}: {session.Department} Session</p>
                                    <p className='date'>Date: {new Date(session.Date).toLocaleDateString()}</p>
                                    <p className='countdown'>
                                        {session.daysLeft > 0 ? `${session.daysLeft} Days Left` : "Session Today!"}
                                    </p>
                                    <button className='attend-button'>Attend</button>
                                </div>
                            ))
                        ) : (
                            <p>No ongoing sessions available.</p>
                        )}
                    </div>
                </section>


                <hr />

                {/* Recommendations */}
                <section className='recommendations'>
                    <h2>Your Recommendations</h2>
                    <div className='recommendation-list'>
                        <div className='recommendation-item' onClick={() => { fetchResources('pdf', batchyear) }}>
                            <p>PDFs</p>
                        </div>
                        <div className="recommendation-item" onClick={() => { fetchResources('video', batchyear) }}>
                            <p>Videos</p>
                        </div>
                        <div className="recommendation-item" onClick={() => { fetchResources('audio', batchyear) }}>
                            <p>Audios</p>
                        </div>
                    </div>
                </section>

                {/* Modal for displaying resources */}
                {showModal && (
                    <div className='modal'>
                        <div className='modal-content'>
                            <h2>{resourceType.toUpperCase()} Resources</h2>
                            {resources.length > 0 ? (
                                <ul>
                                    {resources.map((resource) => (
                                        <li key={resource._id}>

                                            <li className={setIcon}></li>
                                            <a className="no-underline" href={`http://localhost:5001${resource.fileUrl}`} target='_blank' rel='nooper noreferrer'>
                                                {resource.description || resource.fileUrl}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div>
                                    <p>No any {resourceType} Resources have been uploaded yet.</p>
                                </div>
                            )}
                            <button onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentHero;
