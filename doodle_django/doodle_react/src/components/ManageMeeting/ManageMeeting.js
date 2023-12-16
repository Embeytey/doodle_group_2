import React, { useState } from "react";
import timeImage from "../images/time.png";
import locationImage from "../images/location.png";
import videoImage from "../images/video.png";
import descriptionImage from "../images/description.png";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import "./manage.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditableMeeting from "./EditMeetingForm";
import DeleteConfirmation from "./DeleteConfirmation";
import SecondaryButton from "../Utils/SecondaryButton";

const ManageMeeting = ({ data }) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [editConfirmation, setEditConfirmation] = useState(false);
  const [updatedMeeting, setUpdatedMeeting] = useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const onEdit = () => {
    setEditMode(!editMode);
  };

  const onDelete = async (id) => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  let navigate = useNavigate();

  const handleConfirmDelete = async () => {
    try {
      // Perform the deletion logic immediately
      let url = `http://127.0.0.1:8000/api/meetings/${data.id}/delete/`;
      await axios.delete(url);
  
      // Notify the user with a success message
      toast.success("Meeting deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
        },
      });
  
      // After deletion, hide the confirmation box
      setShowDeleteConfirmation(false);
  
      // Navigate to the dashboard
      navigate("/dashboard");
  
      // Display the toast message before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 0); // Wait for 1 second before reloading the page
    } catch (error) {
      console.error("Error deleting meeting:", error);
      // Handle error if needed
      toast.error("Error deleting meeting");
    }
  };
  
  
  
  return (
    <div className="CreateGroup">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {editMode ? (
              <EditableMeeting
                setEditConfirmation={setEditConfirmation}
                setEditMode={setEditMode}
                setUpdatedMeeting={setUpdatedMeeting} // Ensure this line is present
              />
            ) : (
              <>
                {editConfirmation && (
                  <p>Edit successful! Returning to non-editable mode.</p>
                )}
                {updatedMeeting && (
                  <>
                    <h2>{updatedMeeting.title}</h2>
                    <div className="manage_div_info">
                      <img src={timeImage} alt="time.png" />
                      <nobr>{updatedMeeting.duration}</nobr>
                    </div>
                    {updatedMeeting.location !== "" && (
                      <div className="manage_div_info">
                        <img src={locationImage} alt="location.png" />
                        <nobr>{updatedMeeting.location}</nobr>
                      </div>
                    )}
                    {updatedMeeting.video_conferencing === true && (
                      <div className="manage_div_info">
                        <img src={videoImage} alt="video.png" />
                        <nobr>{updatedMeeting.video_type_id}</nobr>
                      </div>
                    )}
                    {/* Add other properties as needed */}
                    {updatedMeeting.description !== "" && (
                      <div className="manage_div_info">
                        <img src={descriptionImage} alt="description.png" />
                        <nobr>{updatedMeeting.description}</nobr>
                      </div>
                    )}
                  </>
                )}
                {!editConfirmation && !updatedMeeting && (
                  <>
                    <h2 style={{ textAlign: "center" }}>{data.title}</h2>
                    <div className="manage_div_info">
                      <img src={timeImage} alt="time.png" />
                      <nobr>{data.duration}</nobr>
                    </div>
                    {data.location !== "" && (
                      <div className="manage_div_info">
                        <img src={locationImage} alt="location.png" />
                        <nobr>{data.location}</nobr>
                      </div>
                    )}
                    {data.video_conferencing === true && (
                      <div className="manage_div_info">
                        <img src={videoImage} alt="video.png" />
                        <nobr>{data.video_type_id}</nobr>
                      </div>
                    )}
                    {data["description"] !== "" && (
                      <div className="manage_div_info">
                        <img src={descriptionImage} alt="description.png" />
                        <nobr>{data["description"]}</nobr>
                      </div>
                    )}
                    {/* Add other properties as needed */}
                  </>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            <div style={{ textAlign: "end" }}>
              <div style={{ width: "-webkit-fill-available", margin: 20 }}>
                <SecondaryButton
                  style={{ width: 100, margin: 20, textAlign: "end" }}
                  functionOnClick={onEdit}
                  variant="contained"
                  text="Edit"
                />
              </div>
              <div style={{ width: "-webkit-fill-available", margin: 20 }}>
                <SecondaryButton
                  style={{
                    width: 100,
                    margin: 20,
                    textAlign: "end",
                    color: "#757575",
                  }}
                  text="Delete"
                  functionOnClick={onDelete}
                  variant="contained"
                />
              </div>
            </div>
          </Grid>
          <DeleteConfirmation
            show={showDeleteConfirmation}
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            meetingTitle={data.title}
          />
        </Grid>
      </Box>
    </div>
  );
};

export default ManageMeeting;
