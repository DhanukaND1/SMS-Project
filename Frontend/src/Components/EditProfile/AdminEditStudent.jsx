import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import "./EditProfile.css";

const AdminEditStudent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({
        sname: "",
        mail: "",
        year: "",
        dept: "",
        mentor: "",
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/student/${id}`);
                setStudent(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching student:", error);
            }
        };
        fetchStudent();
    }, [id]);

    const handleChange = (e) => {
        setStudent({ ...student, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/edit-student/${id}`, student);
            toast.success("Student updated successfully!");
            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 3000);
        } catch (error) {
            toast.error("Error updating student");
            console.error("Error updating student:", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="edit-student-container">
                <h2 className="edit-student-title">Edit Student</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="sname"
                            value={student.sname}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="mail"
                            value={student.mail}
                            onChange={handleChange}
                            className="form-input"
                            required
                            readOnly
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Year</label>
                        <input
                            type="text"
                            name="year"
                            value={student.year}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Department</label>
                        <input
                            type="text"
                            name="dept"
                            value={student.dept}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mentor</label>
                        <input
                            type="text"
                            name="mentor"
                            value={student.mentor}
                            onChange={handleChange}
                            className="form-input"
                            readOnly
                            disabled
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="submit-button">
                            Update Student
                        </button>
                        <button type="button" className="cancel-button" onClick={() => navigate("/admin-dashboard")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AdminEditStudent;
