import React from 'react'
import './Message.css'
import { useNavigate } from 'react-router-dom';

const Message = () => {

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/student-dashboard');
  };

  return (
      <div>

      <button type='button' onClick={handleGoBack} className='msg-go-back'>Go Back to Dashboard</button>
        
      <iframe
        src="http://localhost:3000" // ChatApp URL
        title="ChatApp"
        width="100%"
        height="510px"
        style={{ border: 'none' }}
      />
    </div>
  )
}

export default Message
