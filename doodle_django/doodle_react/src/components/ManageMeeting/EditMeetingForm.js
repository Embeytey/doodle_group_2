import React, { useState, useEffect } from "react";
import axios from "axios";

const EditableMeeting = ({
  setEditConfirmation,
  setEditMode,
  setUpdatedMeeting,
}) => {
  const [meeting, setMeeting] = useState({
    title: "",
    location: "",
    video_conferencing: false,
    duration: "",
    description: "",
    deadline: "",
    passcode: "",
    // Add other fields as needed
  });

  const [updateStatus, setUpdateStatus] = useState({
    success: false,
    error: null,
  });

  useEffect(() => {
    fetchLastMeeting();
  }, []);

  const fetchLastMeeting = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/meetings/");
      const lastMeeting = response.data[response.data.length - 1];
      setMeeting({
        title: lastMeeting.title,
        location: lastMeeting.location,
        video_conferencing: lastMeeting.video_conferencing,
        duration: lastMeeting.duration,
        description: lastMeeting.description,
        deadline: lastMeeting.deadline,
        passcode: lastMeeting.passcode,
        id: lastMeeting.id,
        // Update other fields as needed
      });
    } catch (error) {
      console.error("Error fetching last meeting:", error);
    }
  };

  const handleInputChange = (e) => {
    setMeeting({
      ...meeting,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setMeeting({
      ...meeting,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/meetings/${meeting.id}/`,
        meeting
      );
      console.log("Meeting updated successfully:", response.data);

      setUpdateStatus({
        success: true,
        error: null,
      });
      // Fetch the updated meeting details
      const updatedResponse = await axios.get(
        `http://127.0.0.1:8000/api/meetings/${meeting.id}/`
      );
      const updatedMeeting = updatedResponse.data;

      // Update the state with the updated meeting details
      setUpdatedMeeting(updatedMeeting);
      setEditConfirmation(true);
      // Delay the reset of edit mode and confirmation message
      setTimeout(() => {
        setEditConfirmation(false); // Reset editConfirmation
        setEditMode(false); // Reset editMode
      }, 2000); // Adjust the duration as needed
    } catch (error) {
      console.error("Error updating meeting:", error);

      setUpdateStatus({
        success: false,
        error: "Fill the required fields. Please try again.",
      });
    }
  };

  return (
    <div>
      <h2>Edit Meeting</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={meeting.title}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={meeting.location}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* Add other input fields as needed */}
        <label>
          Video Conferencing:
          <input
            type="checkbox"
            name="video_conferencing"
            checked={meeting.video_conferencing}
            onChange={handleCheckboxChange}
          />
        </label>
        <br />
        <label>
          Duration:
          <input
            type="text"
            name="duration"
            value={meeting.duration}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={meeting.description}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* Add other input fields as needed */}
        <button type="submit">Update</button>

        {updateStatus.success && <p>Meeting updated successfully!</p>}
        {updateStatus.error && (
          <p style={{ color: "red" }}>{updateStatus.error}</p>
        )}
      </form>
    </div>
  );
};

export default EditableMeeting;
