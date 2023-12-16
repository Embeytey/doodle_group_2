// DeleteConfirmation.js
import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const ConfirmationBox = styled("div")({
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  margin: "0 auto", // Center the box horizontally
  position: "fixed", // Set the position to fixed
  top: "50%", // Center vertically
  left: "50%", // Center horizontally
  transform: "translate(-50%, -50%)", // Center the box both vertically and horizontally
  zIndex: 1000, // Adjust the z-index as needed to ensure it appears above other elements
});

const DeleteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#FF0000"), // Red color
  backgroundColor: "#FF0000",
  "&:hover": {
    backgroundColor: "#990000",
  },
  margin: "0 10px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText("#4CAF50"), // Green color
  backgroundColor: "#4CAF50",
  "&:hover": {
    backgroundColor: "#388E3C",
  },
  margin: "0 10px",
}));

const DeleteConfirmation = ({ show, onCancel, onConfirm, meetingTitle }) => {
  if (!show) {
    return null;
  }

  return (
    <ConfirmationBox>
      <p>
        <h2>Delete Permanently?</h2>
      </p>
      <p>{`Deleting "${meetingTitle}" will remove it permanently.`}</p>
      <div>
        <DeleteButton onClick={onCancel} variant="contained">
          Cancel
        </DeleteButton>
        <ConfirmButton onClick={onConfirm} variant="contained">
          Yes, Delete
        </ConfirmButton>
      </div>
    </ConfirmationBox>
  );
};

export default DeleteConfirmation;
