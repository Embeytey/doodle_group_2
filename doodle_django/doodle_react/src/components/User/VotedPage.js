import React, { useState, useEffect } from "react";
import UserPreference from "../User/UserPreference";  // Assuming User component is used for displaying user preferences
import Button from "@mui/material/Button";

import { useNavigate } from 'react-router-dom';
const VotedPage = ({ news, data }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the page is in update mode
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("update")) {
      setIsUpdating(true);
    }
  }, []);

  const handleUpdateClick = () => {
    // Redirect to the original voting page for updating
    navigate(`/voted?id=${data.id}&update=true`);
   
  };

  return (
    <div>
      <UserPreference news={news} data={data} />

      {isUpdating ? (
        // Display a button for updating votes if in update mode
        <Button onClick={handleUpdateClick} variant="contained">
          Update Votes
        </Button>
      ) : (
        // Display additional content specific to the voted page
        <div>
          <h2>Your Vote has been Counted Successfully!</h2>
          {/* Add any other content for the voted page */}
        </div>
      )}
    </div>
  );
};

export default VotedPage;
