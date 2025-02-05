import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Feedback.css";

const Feedback = () => {
  const [mentorName, setMentorName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]); // Format: YYYY-MM-DD
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ mentorName, description, date });
    alert("Feedback submitted anonymously!");
    setMentorName("");
    setDescription("");
  };

  return (
    <div className="cont">
      <button type="button" className="xbtn" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-xmark"></i>
      </button>
        <div className="feedback-container">
        <form onSubmit={handleSubmit}>
          <h2>Feedback Form</h2>

          <label htmlFor="mentor">Mentor Name</label>
          <input
            id="mentor"
            type="text"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            placeholder="Enter mentor's name"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter feedback description"
            required
          ></textarea>

          <label htmlFor="date">Date</label>
          <input id="date" type="text" value={date} readOnly />

          <button type="submit">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
