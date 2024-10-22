import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal.jsx';
import './Mentor.css';
import { useLocation } from 'react-router-dom';

function MentorHero() {
  const location = useLocation();
  const mentorName = location.state?.name; // Fetch mentor's name from state
  const [students, setStudents] = useState([]); // Store students list
  const [selectedBatch, setSelectedBatch] = useState(''); // Store selected batch year
  const [isModalOpen, setIsModalOpen] = useState(false); // For student list modal
  const [resourceModalOpen, setResourceModalOpen] = useState(false); // For upload modal
  const [uploadType, setUploadType] = useState(''); // Store the type of file being uploaded (PDFs, Videos, Audios)
  const [allowedFileTypes, setAllowedFileTypes] = useState(''); // Store allowed file types for validation
  const [resourceForm, setResourceForm] = useState({ batchyear: '', file: null, description: '' }); // Update batch to batchyear
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false); // Success popup state

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

  // Function to hadle file and resource form changes (batch -> batchyear)
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Valide file type
    if(!allowedFileTypes.includes(selectedFile.type)) {
      alert(`Invalid file type! Please upload ${uploadType} files only.`);
      return;
    }

    setResourceForm({
      ...resourceForm,
      file: selectedFile,
    });
  };

  // Handle input change for description and batch year
  const handleInputChange = (e) => {
    setResourceForm({
      ...resourceForm,
      [e.target.name]: e.target.value,
    });
  };

  // Function to open the resource upload modal based on the clicked resource type
  const openResourceModal = (type) => {
    let fileTypes;
    switch (type) {
      case 'PDFs':
        fileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        break;
      case 'Videos':
        fileTypes = ['video/mp4', 'video/mkv', 'video/webm'];
        break;
      case 'Audios':
        fileTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg'];
        break;
      default:
        fileTypes = [];
    }

    setUploadType(type);
    setAllowedFileTypes(fileTypes);
    setResourceModalOpen(true);
  };

  // Function to close the resource upload midal
  const closeResourceModal = () => {
    setResourceModalOpen(false);
  };

  // Function to submit resource upload (batch -> batchyear)
  const uploadResource = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('batchyear', resourceForm.batchyear); // Updated field
    formData.append('description', resourceForm.description);
    formData.append('file', resourceForm.file);

    console.log('Form data being sent:', {
      batchyear: resourceForm.batchyear,
      description: resourceForm.description,
      file: resourceForm.file,
    });

    try {
      const response = await axios.post('http://localhost:5001/api/uploadResource', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Resource uploaded successfully:', response.data);
      setIsSuccessPopupVisible(true);
      closeResourceModal();

      setTimeout(() => {
        setIsSuccessPopupVisible(false);
      }, 3000);
    } catch (error) {
      console.log('Error uploading resource:', error);
    }
  };

  return (
    <div className='dashboard-container'>
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
            <div className='recommendation-item' onClick={() => openResourceModal('PDFs')}>
              <p>PDFs</p>
            </div>
            <div className="recommendation-item" onClick={() => openResourceModal('Videos')}>
              <p>Videos</p>
            </div>
            <div className="recommendation-item" onClick={() => openResourceModal('Audios')}>
              <p>Courses</p>
            </div>
          </div>
        </section>

        {isSuccessPopupVisible && (
          <div className='success-popup'>
            <p>Resource uploaded Successfully</p>
          </div>
        )}

        {/* Upload Resource Modal */}
        {resourceModalOpen && (
          <Modal isOpen={resourceModalOpen} onClose={closeResourceModal} title={`Upload ${uploadType}`}>
            <form onSubmit={uploadResource}>
              <div>
                <label>Select Batch Year:</label>
                <select name='batchyear' value={resourceForm.batchyear} onChange={handleInputChange}>
                  <option value="">Select Batch</option>
                  <option value="19/20">19/20</option>
                  <option value="20/21">20/21</option>
                  <option value="21/22">21/22</option>
                  <option value="22/23">22/23</option>
                </select>
              </div>
              <div>
                <label>File Description:</label>
                <input type='text' name='description' value={resourceForm.description} onChange={handleInputChange} />
              </div>
              <div>
                <label>Upload {uploadType} File:</label>
                <input type='file' name='file' onChange={handleFileChange} />
              </div>
              <button type='submit'>Upload</button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default MentorHero;