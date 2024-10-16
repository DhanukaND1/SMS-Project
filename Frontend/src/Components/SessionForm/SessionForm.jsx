import React from 'react'
import './SessionForm.css'
import Select, { components } from 'react-select';
import { useState } from 'react';


const mentor = {
    "IAT": ['Dr. Hansika Atapattu', 'Dr. Chathurika De Silva', 'Dr. Lakmini Jayasinghe', 'Dr. Ruwan Kalubowila', 'Dr. Udara Mutugala', 'Dr. Sanjaya Thilakerathne', 'Mr. Gihan Amarasinghe', 'Mr. L.M. Samaratunga', 'Mr. Supun Kariyawasam', 'Mr. U.V.H. Sameera'],
    "ICT": ['Dr. Rohan Samarasinghe', 'Ms. Chamindi Kavindya Samarasekara', 'Mr. Chathura Mahasen Bandara', 'Mrs. Nethmini Weerawarna'],
    "AT": ['Dr. Jayani Wewalwela', 'Dr. Aruna Kumara', 'Dr. Priyanga Kariyawasam', 'Dr. K.T. Ariyawansha', 'Mrs. G.W.A.S. Lakmini', 'Ms. Thilini Jayaprada', 'Prof. Kanchana Abeysekera'],
    "ET": ['Dr. Kosala Sirisena', 'Dr. Madhusha Sudasinghe', 'Dr. N.L. Ukwattage', 'Dr. Poorna Piyathilaka', 'Prof. Chamini Hemachandra', 'Prof. Ranjana Piyadasa', 'Prof. Sansfica Young'],
  };


const students = [
  { value: 'S123', label: '2022t01555' },
  { value: 'S124', label: '2022t01556' },
  { value: 'S125', label: '2022t01557' },
  { value: 'S126', label: '2022t01558' },
  { value: 'S128', label: '2022t01559' },
  { value: 'S129', label: '2022t01560' },
  { value: 'S130', label: '2022t01561' },
  { value: 'S131', label: '2022t01562' },
  { value: 'S132', label: '2022t01563' },
  { value: 'S133', label: '2022t01564' },
  
  ];


function SessionForm() {

  const [mentors, setMentors] = useState([]);
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

  const handleStudentChange = (selectedStudents) => {
    setSelectedStudents(selectedStudents);

    setFormData((prevFormData) => ({
      ...prevFormData,
      student: selectedStudents.map(option => option.value), // Store the values in formData
    }));
  }

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if(name === 'dept'){
      setMentors(mentor[value] || []); // Set the mentors based on the selected department
    }   
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
  }

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

  const handleSubmit = (e) => {
    e.preventDefault(); 
  };

  return (
    <div className='session'>
      <form action='' onSubmit={handleSubmit}>
        <h2>Session Data</h2>

        <i className="fa-solid fa-xmark"></i>

        <label htmlFor="dept">Department:</label>
        <select name="dept" id="dept" value={formData.dept} onChange={handleChange} required>
            <option value='' disabled selected>Select Department</option>
            <option value="IAT">IAT</option>
            <option value="ICT">ICT</option>
            <option value="AT">AT</option>
            <option value="ET">ET</option>
        </select>

        <label htmlFor="mentor">Mentor:</label>
        <select id="mentor" name="mentor" value={formData.mentor} onChange={handleChange} required>
          <option value='' disabled selected>Select Mentor</option>
          {mentors.map((mentorName, index) => (
            <option key={index} value={mentorName}>{mentorName}</option>
          ))}
        </select>
        
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
          noOptionsMessage={() => "No students available "}
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
        <textarea name="note" id="note" value={formData.note} onChange={handleChange} rows={4} cols={30} required></textarea>

      <div className='session-btn'>
        <button type='submit' className='sub-btn'>submit</button>
        <button type='clear' className='clear-btn' onClick={clearForm}>Clear</button>
        </div>
  
      </form>
    </div>
  )
}

export default SessionForm