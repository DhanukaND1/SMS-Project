import React, { useState,useRef,useEffect} from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => {

  const [toggleBar, setToggleBar] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const sidebarRef = useRef();

  useEffect(() => {
    const fetchRole = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
            setRole(response.data.role);
            setName(response.data.name);
        } catch (error) {
          console.error('Error fetching role:', error.response ? error.response.data : error.message);
        }
    };
    fetchRole();
}, []);

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
  if(role === 'Mentor'){
    dashboardPath = '/mentor-dashboard'
  }else if(role === 'Student'){
    dashboardPath = '/student-dashboard'
  }
 

  useEffect(()=>{
    document.addEventListener('click',handleSidebar);
  },[]);

  const handleSidebar = (e) => {
    if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
      setToggleBar(false);
    }
  };

  const handleClick = () => {
    setToggleBar(!toggleBar);
  }

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
          
          <Link to={dashboardPath}  className="side-links">
            <i class='bx bxs-dashboard icn' ></i>
              <span className="side-link">Dashboard</span>
            </ Link>
          </li>

          <li className="side-list">
          <Link to='/'  className="side-links">
            <i class='bx bx-bell icn' ></i>
              <span className="side-link">Notification</span>
            </ Link>
          </li>

          <li className="side-list">
          <Link to='/'  className="side-links">
            <i class='bx bx-message-rounded icn' ></i>
              <span className="side-link">Messages</span>
            </ Link>
          </li>

          <li className="side-list">
          <Link to='/calendar'  className="side-links">
            <i class='bx bxs-calendar icn' ></i>
              <span className="side-link">Calendar</span>
            </ Link>
          </li>

          <li className="side-list">
          <Link to='/session-page'  className="side-links">
            <i class='bx bxs-report icn' ></i>
              <span className="side-link">Session Info</span>
            </ Link>
          </li>

          <li className="side-list">
          <Link to='/'  className="side-links">
            <i class='bx bx-comment-detail icn' ></i>
              <span className="side-link">Feedback</span>
            </Link>
          </li>
          
          </ul>

          <div className="bottom-content">

          <ul className="side-lists">
          <li className="side-list">
          <Link to='/'  className="side-links" onClick={handleLogout}>
            <i class='bx bx-log-out icn' ></i>
              <span className="side-link">Logout</span>
            </Link>
          </li>
          </ul>

          </div>
      </div>
      </div>

      <div className="sidecont">
        <ul>
          <li>{name}</li>
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar