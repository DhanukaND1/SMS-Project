import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const userEmail = localStorage.getItem('userEmail'); // Get student email from storage
          const response = await axios.get('http://localhost:5001/api/notifications', { 
            params: { email: userEmail }, // Fetch only this student's notifications
            withCredentials: true 
          });
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };
    
      fetchNotifications();
    }, []);    

  const markNotificationsAsRead = async () => {
    try {
      await axios.post('http://localhost:5001/api/notifications/read', {}, { withCredentials: true });
      setNotifications([]); // Clear notifications from UI
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };  

  const handleNotificationClick = (notification) => {
    if (notification.resourceId) {
      navigate(`/resource/${notification.resourceId}`); // Redirect to the resource page
    }
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li 
              key={notification._id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              {notification.message}
              {!notification.isRead && (
                <button onClick={() => markNotificationsAsRead(notification._id)}>Mark as Read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
