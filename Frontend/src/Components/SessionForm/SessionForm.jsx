import React from 'react'
import './SessionForm.css'
import Select, { components } from 'react-select';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 


function SessionForm() {

  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const[formData, setFormData] = useState({
    dept:'',
    mentor:'',
    year:'',
    student:[],
    date:'',
    mode:'',
    note:''
  });

   // Function to fetch mentors from the backend
   const fetchMentors = async (dept) => {
    console.log("Fetching mentors for department:", dept); // Debugging

    try {
        const response = await fetch(`http://localhost:5001/api/mentors/${dept}`);
        const data = await response.json();
        console.log("Fetched mentors:", data); // Debugging

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format received");
        }

        const formattedMentors = data.map(mentor => ({ value: mentor, label: mentor }));
        setMentors(formattedMentors);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      }
    };
  
  // Function to fetch mentors from the backend
  const fetchStudents = async (year, mentor) => {
    if (!year || !mentor){
      console.log("Batch year or mentor not selected yet.");
      return;
    } // Ensure both fields are selected before fetching

    try {
        const response = await fetch(`http://localhost:5001/api/students/${encodeURIComponent(year)}/${encodeURIComponent(mentor)}`);
        const data = await response.json();

        console.log("Students received:", data); // Debugging

        if (Array.isArray(data) && data.length > 0) {
          const formattedStudents = data.map(student => ({ value: student.index_no, label: student.index_no }));
          setStudents(formattedStudents);
      } else {
          setStudents([]); // Ensure empty state if no students
      }
    } catch (error) {
        console.error('Error fetching students:', error);
    }
};


  const handleStudentChange = (selectedStudents) => {
    setSelectedStudents(selectedStudents);

    setFormData((prevFormData) => ({
      ...prevFormData,
      student: selectedStudents.map(option => option.value), // Store the values in formData
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === 'dept') {
      fetchMentors(value);
      setFormData(prevFormData => ({ ...prevFormData, mentor: '', student: [] }));
      setMentors([]);
      setStudents([]);
    } else if (name === 'mentor' || name === 'year') {
      const newYear = name === 'year' ? value : formData.year;
      const newMentor = name === 'mentor' ? value : formData.mentor;
      fetchStudents(newYear, newMentor);
    }
  };

  const handleMentorChange = (selectedMentor) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      mentor: selectedMentor ? selectedMentor.value : '', // Store only the value
    }));
    fetchStudents(formData.year, selectedMentor ? selectedMentor.value : '');
  };
  

  const clearForm =() => {
    setFormData({
      dept:'',
      mentor:'',
      year:'',
      date:'',
      mode:'',
      note:''
    });
    setSelectedStudents('');
    setStudents([]);
    setMentors([]);
  };

  const MultiValue = ({ index, getValue, ...props }) => {
    const selectedValues = getValue();
    if (index === 2) {
      return (
        <div style={{ padding: '5px', fontSize:'14px' }}>
          + {selectedValues.length - 2} more
        </div>
      );
    }
    if (index > 2) {
      return null;
    }
    return <components.MultiValue {...props} />;
  };

  const handleClose = () => {
    navigate(-1); 
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sessionData = {
      Department: formData.dept,
      Mentor: formData.mentor,
      Year: formData.year,
      Index: formData.student.join(', '), // Convert array to string
      Date: formData.date,
      SessionMode: formData.mode,
      AdditionalNote: formData.note || ''
    };

    try {
      const response = await fetch('http://localhost:5001/api/SessionInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        alert('Session information stored successfully!');
        clearForm();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };


  return (
    <div className='session'>
      <form action='' onSubmit={handleSubmit}>
        <h2>Session Data</h2>

        <i className="fa-solid fa-xmark" onClick={handleClose}></i>

        <label htmlFor="dept">Department:</label>
        <select name="dept" id="dept" value={formData.dept} onChange={handleChange} required>
            <option value='' disabled selected>Select Department</option>
            <option value="IAT">IAT</option>
            <option value="ICT">ICT</option>
            <option value="AT">AT</option>
            <option value="ET">ET</option>
        </select>

        <label htmlFor="mentor">Mentor:</label>
        <Select
          name="mentor"
          id="mentor"
          options={mentors}
          value={mentors.find(m => m.value === formData.mentor) || null}
          onChange={handleMentorChange}
          placeholder="Select Mentor"
          isSearchable
        />
        
        <label htmlFor="year">Batch year: </label>
        <select name="year" id="year" value={formData.year} onChange={handleChange} required>
            <option value='' disabled selected>Select Year</option>
            <option value="19/20">19/20</option>
            <option value="20/21">20/21</option>
            <option value="21/22">21/22</option>
            <option value="22/23">22/23</option>
        </select>

        <label htmlFor="student">Student Index:</label>
        <Select
          name='student'
          id='student'
          isMulti
          options={students}
          value={selectedStudents}
          onChange={handleStudentChange}
          placeholder="Select Students"
          isSearchable={true}
          closeMenuOnSelect={false}
          noOptionsMessage={() => students.length === 0 ? "No students available" : "Loading students..."}
          className='select-student'
          components={{ MultiValue }}
          required
        />


        <label htmlFor="date"  >Date: </label>
        <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required/>

        <label htmlFor="mode" >Mode of Session:</label>
        <select name="mode" id="mode" value={formData.mode} onChange={handleChange} required>
            <option value='' disabled selected>Select Mode</option>
            <option value="Online">Online</option>
            <option value="Physycal">Physical</option>
        </select>

        <label htmlFor="additionalnote">Additional Note:</label>
        <textarea name="note" id="note" value={formData.note} onChange={handleChange} rows={4} cols={30}></textarea>

      <div className='session-btn'>
        <button type='submit' className='sub-btn'>submit</button>
        <button type='clear' className='clear-btn' onClick={clearForm}>Clear</button>
        </div>
  
      </form>
    </div>
  )
}

export default SessionForm