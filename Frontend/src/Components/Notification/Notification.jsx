import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';
import Sidebar from '../Sidebar/Sidebar.jsx'
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import useSessionTimeout from '../../Hooks/useSessionTimeout.jsx'

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [mentor, setMentor] = useState('');
  const [year, setYear] = useState('');
  const {sessionExpired, checkSession} = useSessionTimeout();

  useEffect( () => {
    const loggedUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
        if(response.data.role === 'Student'){
          setMentor(response.data.mentor);
          setYear(response.data.batchyear);
        }
      } catch (error) {
        console.error('Error fetching role:', error.response ? error.response.data : error.message);
      }
    };
    loggedUserInfo();

  }, []);
 

  const fetchNotifications = async () => {
    // if (!mentor || !year) return; // Prevent API call if data is missing
  
    try {
      const response = await axios.get('http://localhost:5001/api/notifications', {
        params: { mentor, year }, // Correcting the query parameters
        withCredentials: true,
      });
  
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  useEffect(() => {
    if (mentor && year) {  // Ensures mentor and year are available before fetching
      fetchNotifications();
    }
  }, [mentor, year]);

  // const markNotificationsAsRead = async (id) => {
  //   try {
  //      await axios.post('http://localhost:5001/api/notifications/read', { notificationId: id }, { withCredentials: true });
  
  //     // Fetch fresh notifications from the server after update
  //     await fetchNotifications();
  //   } catch (error) {
  //     console.error('Error marking notifications as read:', error);
  //   }
  // };
  
  const handleDelete = async (id) => {
    try{
      const response = await axios.delete('http://localhost:5001/api/delete-notifications',{
          params:{ id }
      })
      if(response.data.success){
        toast.success(response.data.message);
        fetchNotifications();
      }
    }catch(error){
      console.error('Error deleting notification', error);
      toast.error('Error deleting notification')
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.url) {
      console.log(notification.url)
      window.open(`http://localhost:5001${notification.url}`);
    }
  };
  console.log(notifications)

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

  return (
    <div>
      <Sidebar />
    
    <div className="notifications-container">
      
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications?.map((notification) => (

            <li key={notification._id} className={`${notification.isRead ? '' : 'unread'}`}>
             <span> {notification.message}</span>

              <div className='notify-btns'>
                {/* {!notification.isRead  &&(
                  <button onClick={() => markNotificationsAsRead(notification._id)} className='mark-notify-btn'>Mark as Read</button>
                )} */}
                <button onClick={() => handleNotificationClick(notification)}>View resource</button>
                <button onClick={() => handleDelete(notification._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
    </div>
  );
};

export default Notifications;
