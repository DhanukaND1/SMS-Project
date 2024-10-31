import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal.jsx';
import './Mentor.css';

function MentorHero() {
  const [mentorName, setMentorName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [allowedFileTypes, setAllowedFileTypes] = useState('');
  const [resourceForm, setResourceForm] = useState({ batchyear: '', file: null, description: '' });
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  useEffect(() => {
    const fetchMentorName = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dashboard', {
          withCredentials: true,
        });
        setMentorName(response.data.name);
      } catch (error) {
        console.log('Error fetching mentor name:', error);
      }
    };

    fetchMentorName();
  }, []);

  const fetchStudents = async (batchyear) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/students?mentorName=${mentorName}&batchyear=${batchyear}`
      );
      setStudents(response.data);
      setSelectedBatch(batchyear);
      setIsModalOpen(true);
    } catch (error) {
      console.log('Error fetching students:', error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!allowedFileTypes.includes(selectedFile.type)) {
      alert(`Invalid file type! Please upload ${uploadType} files only.`);
      return;
    }
    setResourceForm({
      ...resourceForm,
      file: selectedFile,
    });
  };

  const handleInputChange = (e) => {
    setResourceForm({
      ...resourceForm,
      [e.target.name]: e.target.value,
    });
  };

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

  const closeResourceModal = () => setResourceModalOpen(false);

  const uploadResource = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('batchyear', resourceForm.batchyear);
    formData.append('description', resourceForm.description);
    formData.append('file', resourceForm.file);

    try {
      const response = await axios.post('http://localhost:5001/api/uploadResource', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

        <Modal isOpen={isModalOpen} onClose={closeModal} title={`Students from ${selectedBatch} Batch`}>
          <ul className='modal-ul'>
            {Array.isArray(students) && students.length > 0 ? (
              students.map((student, index) => (
                <li key={index} className='modal-li'>
                  {student.sname} ({student.sid})
                </li>
              ))
            ) : (
              <li>No students found for this batch.</li>
            )}
          </ul>
        </Modal>

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

        {resourceModalOpen && (
          <Modal isOpen={resourceModalOpen} onClose={closeResourceModal}>
            <form className="upload-form-container" onSubmit={uploadResource}>
              <h3>Upload {uploadType}</h3>
              <div>
                <label>Select Batch Year:</label>
                <select
                  className="upload-select"
                  name="batchyear"
                  value={resourceForm.batchyear}
                  onChange={handleInputChange}
                >
                  <option value="">Select Batch</option>
                  <option value="19/20">19/20</option>
                  <option value="20/21">20/21</option>
                  <option value="21/22">21/22</option>
                  <option value="22/23">22/23</option>
                </select>
              </div>
              <div>
                <label>File Description:</label>
                <input
                  type="text"
                  name="description"
                  value={resourceForm.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Upload {uploadType} File:</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit">Upload</button>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default MentorHero;
