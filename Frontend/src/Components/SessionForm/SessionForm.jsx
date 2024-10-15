import React from 'react'
import './SessionForm.css'
import Select from 'react-select';
import { useState } from 'react';


const mentor = {
    "IAT": ['Dr. Hansika Atapattu', 'Dr. Chathurika De Silva', 'Dr. Lakmini Jayasinghe', 'Dr. Ruwan Kalubowila', 'Dr. Udara Mutugala', 'Dr. Sanjaya Thilakerathne', 'Mr. Gihan Amarasinghe', 'Mr. L.M. Samaratunga', 'Mr. Supun Kariyawasam', 'Mr. U.V.H. Sameera'],
    "ICT": ['Dr. Rohan Samarasinghe', 'Ms. Chamindi Kavindya Samarasekara', 'Mr. Chathura Mahasen Bandara', 'Mrs. Nethmini Weerawarna'],
    "AT": ['Dr. Jayani Wewalwela', 'Dr. Aruna Kumara', 'Dr. Priyanga Kariyawasam', 'Dr. K.T. Ariyawansha', 'Mrs. G.W.A.S. Lakmini', 'Ms. Thilini Jayaprada', 'Prof. Kanchana Abeysekera'],
    "ET": ['Dr. Kosala Sirisena', 'Dr. Madhusha Sudasinghe', 'Dr. N.L. Ukwattage', 'Dr. Poorna Piyathilaka', 'Prof. Chamini Hemachandra', 'Prof. Ranjana Piyadasa', 'Prof. Sansfica Young'],
  };


const students = [
  { value: 'S123', label: 'S123' },
  { value: 'S124', label: 'S124' },
  { value: 'S125', label: 'S125' },
  { value: 'S126', label: 'S126' },
  { value: 'S127', label: 'S127' },
  // Add more students as needed
];


function SessionForm() {
  const [selectedDept, setSelectedDept] = useState('');
  const [mentors, setMentors] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const handleDeptChange = (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    setMentors(mentor[dept] || []); // Set the mentors based on the selected department
  };

  const handleStudentChange = (selectedOptions) => {
    setSelectedStudents(selectedOptions); // Set the selected students
  };

  const formatGroupLabel = (data) => {
    const count = data.length - 3; // Show only first 3 items
    return count > 0 ? `${data.slice(0, 3).map(opt => opt.label).join(', ')} + ${count} more` : data.map(opt => opt.label).join(', ');
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // You can now submit or process the form data, e.g., sending it to a server
    console.log({
      mentorName: e.target.mentor.value,
      selectedStudents,
      sessionMode: e.target.mode.value,
      location: e.target.location ? e.target.location.value : '',
      platform: e.target.platform ? e.target.platform.value : '',
    });
  };

  return (
    <div className='session'>
      <form action={handleSubmit}>
        <h2>Session Data</h2>

        <i className="fa-solid fa-xmark"></i>

        <label htmlFor="dept">Department:</label>
        <select name="dept" id="dept" onChange={handleDeptChange} required>
            <option disabled selected>Select Department</option>
            <option value="IAT">IAT</option>
            <option value="ICT">ICT</option>
            <option value="AT">AT</option>
            <option value="ET">ET</option>
        </select>

        <label htmlFor="mentor">Mentor:</label>
        <select id="mentor" name="mentor" required>
          <option value="" disabled selected>Select Mentor</option>
          {mentors.map((mentorName, index) => (
            <option key={index} value={mentorName}>{mentorName}</option>
          ))}
        </select>
        
        <label htmlFor="year">Batch year: </label>
        <select name="year" id="year" required>
            <option disabled selected>Select year</option>
            <option value="19/20">19/20</option>
            <option value="20/21">20/21</option>
            <option value="21/22">21/22</option>
            <option value="22/23">22/23</option>
        </select>

        <label htmlFor="student" required>Student Index:</label>
        <Select
          isMulti
          options={students}
          value={selectedStudents}
          onChange={handleStudentChange}
          placeholder="Select Students"
          isSearchable={true}
          closeMenuOnSelect={false}
          formatOptionLabel={(opt, { context }) => {
            if (context === 'value') {
              return formatGroupLabel(selectedStudents); // Only show the first 3 students in the selected label
            }
            return opt.label;
          }}
        />


        <label htmlFor="date" required>Date: </label>
        <input type="date" name="date" id="date" />

        <label htmlFor="mode" required>Mode of Session:</label>
        <select name="mode" id="mode">
            <option value="" disabled selected>select mode</option>
            <option value="Online">Online</option>
            <option value="Physycal">Physical</option>
        </select>

        <label htmlFor="additionalnote">Additional Note:</label>
        <textarea name="note" id="note" rows={4} cols={30} ></textarea>

        <button type='submit' className='sub-btn'>submit</button>
        <button type='clear' className='clear-btn'>Clear</button>
        

        

        
      </form>
    </div>
  )
}

export default SessionForm
