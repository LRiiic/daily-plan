import React, { useState, useEffect } from 'react';
import './style.css';

const Toast = ({ message, type, show, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer;
    
    if (show) {
      setIsExiting(false);
      
      timer = setTimeout(() => {
        handleClose();
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [show]);

  const handleClose = () => {
    setIsExiting(true);
    
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 300);
  };

  if (!show) return null;

  return (
    <div className={`toast ${type} ${isExiting ? 'toast-exit' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === 'success' && <span>✓</span>}
          {type === 'error' && <span>✕</span>}
          {type === 'info' && <span>i</span>}
        </div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default Toast;