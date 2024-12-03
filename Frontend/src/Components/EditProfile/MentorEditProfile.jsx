import React from 'react'
import './EditProfile.css'
import profilePic from '../../assets/profilepic.png';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Footer from '../Footer/Footer.jsx';
import {Link} from 'react-router-dom'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSessionTimeout from '../../Hooks/useSessionTimeout.jsx';

const MentorEditProfile = () => {

  const [mentorData, setMentorData] = useState({name: '',email: '',role: '',dept: '',phone: '' });
  const [role, setRole] = useState('');
  const [mail, setMail] = useState('');
  const [selectedImage, setSelectedImage] = useState(profilePic);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const {sessionExpired, checkSession} = useSessionTimeout();

  useEffect(() => {
    checkSession(); // Trigger session check on component mount
  }, []);

  if (sessionExpired) {
    return (
      <div className="session-expired-overlay">
        <div className="session-expired-message">
          <h2><i class='bx bxs-error warning'></i>Session Expired</h2>
          <p>Your session has expired. Please log in again.</p>
          <Link to="/login" className='link'>Login</Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchRole = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
            setRole(response.data.role);
            setMail(response.data.email);
            if(response.data.role === 'Mentor'){
              setMentorData(response.data);
            }
        } catch (error) {
          console.error('Error fetching role:', error.response ? error.response.data : error.message);
        }
    };
    fetchRole();
  }, []);

  useEffect(() => {
  const fetchImage = async () => {  
    if (mail && role){

      try{
      const response = await axios.get('http://localhost:5001/api/image', {
          params: {
            email: mail,
            role: role
          }
        })
        if (response.data.success) {
    
          const imageUrl = `http://localhost:5001${response.data.image}`;
          setSelectedImage(imageUrl);
        } else {
          console.error('Mentor not found');
          setSelectedImage(profilePic);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        console.error('Error fetching image:', error.message);
        
      }
    }
  };
  fetchImage();
  }, [mail, role]);


  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleChange = (e) => {

    const { name, value } = e.target;
    setMentorData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Preview the selected image

      const formData = new FormData();
      formData.append('image', file);
      formData.append('mail', mail);

      try {
        // Send the image to the server using Axios
        const response = await axios.post('http://localhost:5001/api/update-mentor-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure the server knows it's a file upload
          },
          withCredentials: true,
        });
  
        if (response.data.success) {
          toast.success('Image uploaded successfully');
        } else {
          toast.warn('Error uploading image');
        }
      } catch (error) {
        console.error('Error uploading file:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div onClick={handleClickOutside}>
      <Sidebar />
      <div className='upload-prof root'>
        <section id="home">
        <form action="" className='form' onSubmit={handleSubmit}>
        <div className="edit-image">
        <img src={selectedImage || profilePic } alt="" />
        <span  onClick={handleClick}>Edit <i className='bx bxs-pencil'></i></span>
              
        <ul className={isOpen?'show':'hide'} ref={menuRef}>
          <li className='add-pic-li' onClick={handleFileInputClick} >Add Picture</li>
          <li>Remove Picture</li>  
        </ul>
        <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }} // Hide the file input
                onChange={handleFileChange}
              />
        </div>
        <label htmlFor="">Mentor Name</label>
        <input type="text" name='name' value={mentorData.name} onChange={handleChange} />

        <label htmlFor="">Department</label>
        <select name="dept" value={mentorData.dept} onChange={handleChange}>
        <option value="ict">ICT</option>
        <option value="lat">IAT</option>
        <option value="et">ET</option>
        <option value="at">AT</option>
      </select>
      
        <label htmlFor="">Mentor Mail</label>
        <input type="text" name='email' value={mentorData.email} onChange={handleChange} />
  
        <label htmlFor="">Phone Number</label>
        <input type="tel" name='phone' value={mentorData.phone} onChange={handleChange} />
  
        

        <div className='edit-prof'>
        <button type='submit'>Upload Profile</button>
        <Link to='/profile' className='link'><button>Cancel</button></Link>
        </div>
        </form>
        </section>
        
        
      </div>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default MentorEditProfile;
