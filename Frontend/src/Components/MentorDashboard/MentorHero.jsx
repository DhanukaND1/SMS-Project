// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import Modal from './Modal.jsx';
// import './Mentor.css'
// import img1 from '../../assets/1.webp';

// function MentorHero() {
//   const [mentorName, setMentorName] = useState(''); // State to store the mentor's name
//   const [students, setStudents] = useState([]); // Store students list
//   const [selectedBatch, setSelectedBatch] = useState(''); // Store selected batch year
//   const [isModalOpen, setIsModalopen] = useState(false);

//   // Fetch mentor's name on component mount
//   useEffect(() => {
//     const fetchMentorName = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/dashboard', {
//           withCredentials: true // Include cookies (for session)
//         });
//         setMentorName(response.data.name); // Set the mentor's name
//       } catch (error) {
//         console.log('Error fetching mentor name:', error);
//       }
//     };

//     fetchMentorName(); // Call the function to fetch the name
//   }, []);

//   //Function to fetch students based on selected batch year
//   const fetchStudents = async (batchyear) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/students?mentorName=${mentorName}&batchyear=${batchyear}`);
//       setStudents(response.data); // Store the fetched students
//       setSelectedBatch(batchyear); // Update the selected batch year
//       setIsModalopen(true);
//     } catch (error) {
//       console.log('Error fetching students:', error);
//     }
//   };

//   //Function to close the modal
//   const closeModal = () => {
//     setIsModalopen(false);
//   }

//   return (
//     <div className='dashboard-container'>
//       {/* Sidebar */}
//       <aside className='sidebar'>
//         <div className='sidebar-header'>
//           <img src={img1} alt='pro' className='profile-pic' />
//           <h2>{mentorName}</h2>
//           <span>Mentor</span>
//         </div>
//         <nav className='nav-menu'>
//           <ul>
//             <li><a href='#'>Dashboard</a></li>
//             <li><a href="#">Messages</a><span className="notification">4</span></li>
//             <li><a href="#">Calendar</a></li>
//             <li><a href="#">Info Sessions</a></li>
//           </ul>
//         </nav>
//       </aside>

      
//       <div className="mentorhero-container">
//         <section className="mentor-welcome">
//           <p className="mentor-greeting">
//             Welcome Back<br />
//             <span className="mentor-name">{mentorName}</span>
//           </p>
//           <button className="messages-button">Check Messages</button>
//         </section>

//         <section className="student-list">
//           <h2>Student List of Mentoring</h2>
//           <div className="batches">
//             {['19/20', '20/21', '21/22', '22/23'].map((batch) => (
//               <div className="batch" key={batch}>
//                 <h3>{batch} Batch</h3>
//                 <button className="student-button" onClick={() => fetchStudents(batch)}>
//                   Check Students List
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Modal to display student list */}
//         <Modal isOpen={isModalOpen} onClose={closeModal} title={`Students from ${selectedBatch} Batch`}>
//           <ul>
//             {students.length > 0 ? (
//               students.map((student, index) => (
//                 <li key={index}>
//                   {student.name} ({student.id})
//                 </li>
//               ))
//             ) : (
//               <li>No students found for this batch.</li>
//             )}
//           </ul>
//         </Modal>

//         {/* Recommendations */}
//         <section className='recommendations'>
//           <h2>Your Recommendations</h2>
//           <div className='recommendation-list'>
//             <div className='recommendation-item'>
//               <p>Books</p>
//             </div>
//             <div className="recommendation-item">
//               <p>Videos</p>
//             </div>
//             <div className="recommendation-item">
//               <p>Courses</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default MentorHero;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal.jsx';
import './Mentor.css';
import img1 from '../../assets/1.webp';
import { useLocation } from 'react-router-dom';

function MentorHero() {
  const location = useLocation();
  const mentorName = location.state?.name; // Fetch mentor's name from state
  const [students, setStudents] = useState([]); // Store students list
  const [selectedBatch, setSelectedBatch] = useState(''); // Store selected batch year
  const [isModalOpen, setIsModalOpen] = useState(false); // For student list modal

  // Function to fetch students based on selected batch year
  const fetchStudents = async (batchyear) => {
    console.log('Batch year selected:', batchyear);
    try {
      // Trim the batchyear before sending the request
      const response = await axios.get(`http://localhost:5001/api/students?mentorName=${mentorName}&batchyear=${batchyear}`);
      setStudents(response.data); // Store the fetched students
      setSelectedBatch(batchyear); // Update the selected batch year
      setIsModalOpen(true);
    } catch (error) {
      console.log('Error fetching students:', error);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='dashboard-container'>
      {/* Sidebar */}
      {/* <aside className='sidebar'>
        <div className='sidebar-header'> */}
          {/* <img src={img1} alt='pro' className='profile-pic' /> */}
          {/* <h2> {mentorName}</h2>
          <span>Mentor</span>
        </div> */}
        {/* <nav className='nav-menu'>
          <ul>
            <li><a href='#'>Dashboard</a></li>
            <li><a href="#">Messages</a><span className="notification">4</span></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="#">Info Sessions</a></li>
          </ul>
        </nav> */}
      {/* </aside> */}

      <div className="mentorhero-container">
        <section className="mentor-welcome home">
          <p className="mentor-greeting">
            Welcome Back<br />
            <span className="mentor-name">{mentorName}</span>
          </p>
          <button className="messages-button">Check Messages</button>
        </section>

        <section className="student-list">
          <h2>Student List of Mentoring</h2>
          <div className="batches">
            {['19/20', '20/21', '21/22', '22/23'].map((batch) => (
              <div className="batch" key={batch}>
                <h3>{batch} Batch</h3>
                <button className="student-button" onClick={() => fetchStudents(batch)}>
                  Check Student List
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Modal to display student list */}
        <Modal isOpen={isModalOpen} onClose={closeModal} title={`Students from ${selectedBatch} Batch`}>
          <ul>
            {Array.isArray(students) && students.length > 0 ? (
              students.map((student, index) => (
                <li key={index}>
                  {student.sname} ({student.sid})
                </li>
              ))
            ) : (
              <li>No students found for this batch.</li>
            )}
          </ul>
        </Modal>

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

export default MentorHero;