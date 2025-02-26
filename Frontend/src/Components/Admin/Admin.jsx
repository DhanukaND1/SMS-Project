import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSessionTimeout from "../../Hooks/useSessionTimeout.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Admin.css";

const Admin = () => {
    const [activeTab, setActiveTab] = useState("students");
    const [students, setStudents] = useState([]);
    const [mentors, setMentors] = useState([]);
    const { sessionExpired, checkSession } = useSessionTimeout();

    useEffect(() => {
        checkSession(); // Trigger session check on component mount
    }, []);

    if (sessionExpired) {
        return (
            <div className="session-expired-overlay">
                <div className="session-expired-message">
                    <h2>
                        <i class="bx bxs-error warning"></i>Session Expired
                    </h2>
                    <p>Your session has expired. Please log in again.</p>
                    <Link to="/login" className="link">
                        Login
                    </Link>
                </div>
            </div>
        );
    }
    const [sliderPosition, setSliderPosition] = useState("0%");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5001/api/allstudents"
                );
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5001/api/allmentors"
                );
                setMentors(response.data);
            } catch (error) {
                console.error("Error fetching mentors:", error);
            }
        };
        fetchMentors();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5001/api/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSliderPosition(tab === "students" ? "0%" : "50%");
    };

    const handleStudentDelete = async (studentId) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this student?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:5001/api/delete-students/${studentId}`);
                            toast.success('Student deleted successfully!');
                            const response = await axios.get("http://localhost:5001/api/allstudents");
                            setStudents(response.data);
                        } catch (error) {
                            console.error("Error deleting student:", error);
                            toast.error('Error deleting student');
                        }
                    }
                },
                {
                    label: "No",
                    onClick: () => console.log("Deletion cancelled")
                }
            ]
        });
    };

    const handleMentorDelete = async (mentorId) => {
        confirmAlert({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this mentor?",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:5001/api/delete-mentor/${mentorId}`);
                            toast.success('Mentor deleted successfully!');
                            // Refresh mentor list
                            const response = await axios.get("http://localhost:5001/api/allmentors");
                            setMentors(response.data);
                        } catch (error) {
                            toast.error('Error deleting mentor!')
                            console.error("Error deleting mentor:", error);
                        }
                    }
                },
                {
                    label: "No",
                    onClick: () => console.log("Mentor deletion cancelled")
                }
            ]
        });
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2 className="admin-title">Admin Dashboard</h2>
                <Link to="/login" className="logout-btn" onClick={handleLogout}>
                    Logout
                </Link>
            </div>
            <div className="tabs-container">
                <div className="tabs">
                    <button
                        className={`tab ${
                            activeTab === "students" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("students")}
                    >
                        Students
                    </button>
                    <button
                        className={`tab ${
                            activeTab === "mentors" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("mentors")}
                    >
                        Mentors
                    </button>
                    <div
                        className="sliderr"
                        style={{
                            left: sliderPosition,
                            transition: "left 0.3s ease-in-out",
                        }}
                    />
                </div>
            </div>

            <div className="content-container">
                {activeTab === "students" && (
                    <div className="table-section">
                        <h3 className="section-title">Student List</h3>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>year</th>
                                        <th>department</th>
                                        <th>mentor</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td>{student.sid}</td>
                                            <td>{student.sname}</td>
                                            <td>{student.mail}</td>
                                            <td>{student.year}</td>
                                            <td>{student.dept}</td>
                                            <td>{student.mentor}</td>
                                            <td className="actions-cell">
                                                <Link
                                                    to={`/admin-edit-student/${student._id}`}
                                                    className="update-btn"
                                                >
                                                    Update
                                                </Link>{" "}
                                                |
                                                <Link
                                                    to={``}
                                                    onClick={() => handleStudentDelete(student._id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {activeTab === "mentors" && (
                    <div className="table-section">
                        <h3 className="section-title">Mentor List</h3>
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Phone</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mentors.map((mentor) => (
                                        <tr key={mentor._id}>
                                            <td>{mentor.name}</td>
                                            <td>{mentor.mail}</td>
                                            <td>{mentor.dept}</td>
                                            <td>{mentor.phone}</td>

                                            <td>{mentor.expertise}</td>
                                            <td className="actions-cell">
                                                <Link
                                                    to={`/admin-edit-mentor/${mentor._id}`}
                                                    className="update-btn"
                                                >
                                                    Update
                                                </Link>{" "}
                                                |
                                                <Link
                                                    to={``}
                                                    onClick={() => handleMentorDelete(mentor._id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Admin;
