// FeedbackListPage.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackEntry from "./FeedbackEntry";
import { FaTrash } from 'react-icons/fa';
import "./styles.css";

const FeedbackListPage = () => {
  const [feedbackEntries, setFeedbackEntries] = useState([]);
  const [originalFeedbackList, setOriginalFeedbackList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch feedback data from the backend API
    axios.get("http://127.0.0.1:8000/api/feedbacks/")
      .then(response => {
        setFeedbackEntries(response.data);
        setOriginalFeedbackList(response.data);
      })
      .catch(error => {
        console.error("Error fetching feedback data:", error);
      });
  }, []); // Run this effect only once when the component mounts

  
  const handleSearch = () => {
    // Perform search based on the searchTerm
    const filteredFeedbacks = originalFeedbackList.filter(entry =>
      (entry.name.toLowerCase() === searchTerm.toLowerCase())
    );
  
    console.log("Filtered Feedbacks:", filteredFeedbacks);
    setFeedbackEntries(filteredFeedbacks);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFeedbackEntries(originalFeedbackList);
  };

  const handleDelete = (id) => {
    // axios.delete(`http://127.0.0.1:8000/api/feedbacks/${id}/`)
    axios.delete(`http://127.0.0.1:8000/api/feedbacks/${id}/`)
      .then(response => {
        // Update the feedbackEntries after successful deletion
        setFeedbackEntries(prevFeedbacks => prevFeedbacks.filter(entry => entry.id !== id));
        // Remove the deleted entry from the originalFeedbackList
        setOriginalFeedbackList(prevFeedbacks => prevFeedbacks.filter(entry => entry.id !== id));
      })
      .catch(error => {
        console.error("Error deleting feedback:", error);
      });
  };
  console.log("feedbackEntries:", feedbackEntries);


  return (
    <div className="feedback">
     
      <h2 style={{ margin: 0, marginLeft: "400px" , marginBottom: "30px"}}>Feedback Entries</h2>

      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", width: "100px", marginRight: "10px", borderRadius: "5px" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px", background: "grey", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Search</button>
        <button onClick={handleReset} style={{ padding: "10px", background: "grey", color: "white", border: "none", borderRadius: "5px", marginLeft: "10px", cursor: "pointer" }}>Reset</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {feedbackEntries.map((entry) => (
          <FeedbackEntry
             key={entry.id}
             id={entry.id}
             user_id={entry.user_id}  // Check if entry.user is not null
            name={ entry.name}      // Check if entry.user is not null
            message={entry.message}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default FeedbackListPage;
