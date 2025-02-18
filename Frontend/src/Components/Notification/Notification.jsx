import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';
import Sidebar from '../Sidebar/Sidebar.jsx'
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [mentor, setMentor] = useState('');
  const [year, setYear] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect( () => {
    const loggedUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dashboard', { withCredentials: true });
        setRole(response.data.role);
        if(role === 'Student'){
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
    try {
      const response = await axios.get('http://localhost:5001/api/notifications', {
        params: { mentor: mentor, year: year },
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const markNotificationsAsRead = async (id) => {
    try {
      await axios.post('http://localhost:5001/api/notifications/read', { notificationId: id }, { withCredentials: true });
  
      // Call fetchNotifications again to refresh the list
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  // Ensure notifications are fetched when mentor/year updates
  useEffect(() => {
    if (mentor && year) {
      fetchNotifications();
    }
  }, [mentor, year]);
  
  
  const handleDelete = async (id) => {
    try{
      const response = await axios.delete('http://localhost:5001/api/delete-notifications',{
          params:{ id: id}
      })
      if(response.data.success){
        toast.success(response.data.message);
      }
    }catch(error){
      console.error('Error deleting notification', error);
      toast.error('Error deleting notification')
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.url) {
      console.log(notification.url)
      window.open(`http://localhost:5001${notification.url}`); // Redirect to the resource page
    }
  };
  console.log(notifications)

  return (
    <div className="notifications-container">
      <Sidebar />
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications?.map((notification) => (

            <li key={notification._id} className={`${notification.isRead ? '' : 'unread'}`}>
             <span> {notification.message}</span>

              <div className='notify-btns'>
                {!notification.isRead &&(
                  <button onClick={() => markNotificationsAsRead(notification._id)} className='mark-notify-btn'>Mark as Read</button>
                )}
                <button onClick={() => handleNotificationClick(notification)}>View resource</button>
                <button onClick={() => handleDelete(notification._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default Notifications;
