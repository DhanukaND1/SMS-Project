import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDash.css';
import img1 from '../../assets/1.webp';


function StudentHero() {
    const [studentName, setStudentName] = useState('');
    const [mentorName, setMentorName] = useState('');
    const [batchyear, setBatchYear] = useState('');
    const [resources, setResources] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [resourceType, setResourceType] = useState('');

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
            console.error('Error fetching resources:', error.response?.data || error.message);
        }
    };

    return (
        <div className='dashboard-container'>
            <div className="studenthero-container">
                <section className="student-welcome home">
                    <p className="student-greeting">
                        Welcome Back<br />
                        <span className="student-name">{studentName}</span>
                        <br />
                        <h4>Mentor Name : <span className='yourmentor-name'>{mentorName}</span></h4>
                        
                    </p>
                    <button className="messages-button">Check Messages</button>
                </section>

                <hr />

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
                                            <a href={`http://localhost:5001${resource.fileUrl}`} target='_blank' rel='nooper noreferrer'>
                                                {resource.description || resource.fileUrl}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No {resourceType} Resources found for batch {batchyear}.</p>
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
