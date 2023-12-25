// FeedbackEntry.js

import React from 'react';
import { FaTrash } from 'react-icons/fa';

const FeedbackEntry = ({ id, user_id, name, message, onDelete }) => {
  const handleDelete = () => {
    // Invoke the onDelete function with the feedback entry ID
    onDelete && onDelete(id);
  };

  return (
    <div className="feedback-entry" style={{ marginBottom: "10px", padding: "15px", background: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", width: "500px", display: "flex", flexDirection: "column" }}>
    <div>
      {/* <strong> ID:</strong> {id || 'N/A'}<br /> */}
      {/* <strong>User ID:</strong> { user_id|| 'N/A'}<br /> */}
      <strong>User Name:</strong> {name || 'N/A'}<br />
   
      
      <div style={{ marginTop: "10px", overflow: "hidden", wordWrap: "break-word", maxWidth: "100%" }}>
        <strong>Message:</strong> {message}
      </div>
     
      
    </div>
      <button onClick={handleDelete} style={{ marginTop: "10px", padding: "5px", background: "transparent", border: "none", cursor: "pointer" }}>
        <FaTrash style={{ marginRight: 'auto' ,marginLeft:  "450px"}} />
      </button>
    </div>
  );
};

export default FeedbackEntry;
