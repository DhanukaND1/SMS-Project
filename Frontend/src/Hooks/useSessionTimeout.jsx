import { useEffect, useState } from 'react';
import axios from 'axios';

const useSessionTimeout = () => {

  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/check-session', { withCredentials: true });
        if (!response.data.isActive) {
          setSessionExpired(true);  // Session expired, set state to true
          await axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        setSessionExpired(true);  // Session expired, handle errors by marking it as expired
        await axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true });
      }
    };

    // Check session every 15 seconds
    const interval = setInterval(checkSession, 15000);
    console.log(sessionExpired);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return sessionExpired; // Return sessionExpired state so that the component can render the UI
};

export default useSessionTimeout;
