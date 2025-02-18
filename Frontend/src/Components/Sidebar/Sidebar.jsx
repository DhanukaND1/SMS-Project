import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import profilePic from '../../assets/profilepic.png';

const Sidebar = ({ image }) => {

  const [toggleBar, setToggleBar] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const sidebarRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
        setRole(response.data.role);
        setName(response.data.name);
        setMail(response.data.email);
      } catch (error) {
        console.error('Error fetching role:', error.response ? error.response.data : error.message);
      }
    };
    fetchRole();
  }, []);

  //Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".sidecont")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      if (mail && role) {
        try {
          const response = await axios.get('http://localhost:5001/api/image', {
            params: { email: mail, role: role }
          });

          if (response.data.success) {
            const imagePath = response.data.image;
            const imageCheckResponse = await axios.get('http://localhost:5001/api/check-image', {
              params: { image: imagePath.replace('/uploads/', '') }
            });

            if (imageCheckResponse.data.success) {
              setSelectedImage(`http://localhost:5001/api${imagePath}`);
            } else {
              setSelectedImage(null); // Fallback to default image
            }
          } else {
            setSelectedImage(null); // Fallback to default image
          }
        } catch (error) {
          console.error('Error fetching image:', error);
          setSelectedImage(null); // Fallback to default image
        }
      }
    };
    fetchImage();
  }, [mail, role]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
      });

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  let dashboardPath = '';
  console.log(role);
  if (role === 'Mentor') {
    dashboardPath = '/mentor-dashboard'
  } else if (role === 'Student') {
    dashboardPath = '/student-dashboard'
  } else {
    dashboardPath = '/student-dashboard'
  }


  useEffect(() => {
    document.addEventListener('click', handleSidebar);
  }, []);

  const handleSidebar = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setToggleBar(false);
    }
  };

  const handleClick = () => {
    setToggleBar(!toggleBar);
  }

  const handleChatClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setShowChat(true);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!mail) return; // Ensure email is available
        const response = await axios.get('http://localhost:5001/api/notifications', { 
          params: { email: mail }, withCredentials: true 
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    fetchNotifications();
  }, [mail]);    

  const markNotificationsAsRead = async () => {
    try {
      await axios.post('http://localhost:5001/api/notifications/read', {}, { withCredentials: true });
      // setNotifications([]); // Clear notifications from UI
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };  

  return (
    <nav ref={sidebarRef}>

      <div className="side-logo">
        <span onClick={handleClick}><i class='bx bx-menu side-menu' ></i></span>
        <span className="logo-name">SMS</span>
      </div>

      <div className="side-bar" id={toggleBar ? "" : "hide-sidebar"}>

        <div className="side-logo">
          <span onClick={handleClick}><i class='bx bx-menu side-menu' ></i></span>
          <span className="logo-name">SMS</span>
        </div>

        <div className="sidebar-content">

          <ul className="side-lists">

            <li className="side-list">

              <Link to={dashboardPath} className="side-links">
                <i class='bx bxs-dashboard icn' ></i>
                <span className="side-link">Dashboard</span>
              </ Link>
            </li>

            <li className="side-list">
              <Link to='/profile' className="side-links">
                <i class='bx bxs-user icn' ></i>
                <span className="side-link">Profile</span>
              </ Link>
            </li>

            <li className="side-list">
              <Link to='/messages' className="side-links">
                <i class='bx bxs-message-rounded icn' ></i>
                <span className="side-link">Messages</span>
              </ Link>
            </li>

            <li className="side-list">
              <Link to="/notifications" className="side-links" >
                <i class='bx bxs-bell icn'></i>
                <span className="side-link">Notifications {notifications.length > 0 && `(${notifications.length})`}</span>
              </Link>
            </li>

            <li className="side-list">
              <Link to='/calendar' className="side-links">
                <i class='bx bxs-calendar icn' ></i>
                <span className="side-link">Calendar</span>
              </ Link>
            </li>

            {role === 'Mentor' && (
              <li className="side-list">
                <Link to='/session-form' className="side-links">
                  <i class='bx bxs-edit icn'></i>
                  <span className="side-link">Session Form</span>
                </ Link>
              </li>
            )}


            <li className="side-list">
              <Link to='/session-page' className="side-links">
                <i class='bx bxs-report icn' ></i>
                <span className="side-link">Session Info</span>
              </ Link>
            </li>


            {role === "Student" && (
              <li className="side-list">
                <Link to='/feedback' className="side-links">
                  <i class='bx bxs-comment-detail icn' ></i>
                  <span className="side-link">Feedback</span>
                </Link>
              </li>
            )}

            {mail === "jayani@at.cmb.ac.lk" && (
              <li className="side-list">
                <Link to='/view-feedback' className="side-links">
                  <i class='bx bxs-comment-detail icn' ></i>
                  <span className="side-link">View Feedbacks</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="bottom-content">

            <ul className="side-lists">
              <li className="side-list">
                <Link to='/' className="side-links" onClick={handleLogout}>
                  <i class='bx bx-log-out icn' ></i>
                  <span className="side-link">Logout</span>
                </Link>
              </li>
            </ul>

          </div>
        </div>
      </div>

      <div className="sidecont" onClick={() => setShowDropdown(!showDropdown)}>
        <ul>
          <li className='user-name'><Link>{name}</Link></li>
          <li><img src={image || selectedImage || profilePic} alt="Profile" /></li>
          <i className={`bx ${showDropdown ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
        </ul>

        {showDropdown && (
          <div className='dropdown-menu'>
            <Link to="/profile" className='dropdown-item'>Profile</Link>
            <Link to="/" className='dropdown-item' onClick={handleLogout}>Logout</Link>
          </div>
        )}
      </div>

      <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
          <i className="bx bxs-bell"></i>
          {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
        </div>

        {showNotifications && (
          <div className="notification-dropdown">
            <h5>Notifications</h5>
            <p>You have {notifications.length} notifications</p>
            <Link to='/notifications' className='check-notify'>Check </Link>
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <div>
                {/* <div key={index} className="notification-item"> */}
                  {/* <p>{notif.message}</p> */}
                  {/* <small>{new Date(notif.createdAt).toLocaleString()}</small> */}
                {/* </div> */}
                </div>
              ))
            ) : (
              <p>No new notifications</p>
            )}
            
          </div>
        )}
      

    </nav>
  )
}

export default Sidebar