import React, { useState } from "react";
import FeedbackFormPage from "./FeedbackFormPage";
import FeedbackImage from "./FeedbackImage";
import { Link } from "react-router-dom";

const FeedbackComponent = () => {
  const [formVisibility, setFormVisibility] = useState(false);

  const feedbackImageClick = () => {
    setFormVisibility(!formVisibility);
  };

  return (
    <div>
      {formVisibility ? (
        <FeedbackFormPage setFormVisibility={setFormVisibility} />
      ) : (
        <div>
          {/* <Link to="/feedback-list">View Feedback List</Link> */}
          <FeedbackImage feedbackImageClick={feedbackImageClick} />
        </div>
      )}
    </div>
  );
};

export default FeedbackComponent;
