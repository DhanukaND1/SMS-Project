import React from 'react';
import './Modal.css';  // Add your own styles here

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render anything if the modal is closed

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
