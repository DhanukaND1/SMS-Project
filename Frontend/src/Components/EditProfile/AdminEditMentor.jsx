import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditProfile.css"; // Import the CSS file

const AdminEditMentor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState({
        name: "",
        mail: "",
        phone: "",
        dept: "",
    });

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/mentor/${id}`);
                setMentor(response.data);
            } catch (error) {
                console.error("Error fetching Mentor:", error);
            }
        };
        fetchMentor();
    }, [id]);

    const handleChange = (e) => {
        setMentor({ ...mentor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5001/api/edit-mentor/${id}`, mentor);
            toast.success("Mentor updated successfully!");
            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 3000);
            
           
        } catch (error) {
            toast.error("Error updating Mentor");
            console.error("Error updating Mentor:", error);
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="edit-mentor-container">
                <h2 className="edit-mentor-title">Edit Mentor</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={mentor.name}
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
                            value={mentor.mail}
                            onChange={handleChange}
                            className="form-input"
                            required
                            readOnly
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={mentor.phone}
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
                            value={mentor.dept}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>
                    
                    <div className="button-group">
                        <button type="submit" className="submit-button">
                            Update Mentor
                        </button>
                        <button type="button" className="cancel-button" onClick={() => navigate("/admin-dashboard")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditMentor;
