import React from "react";
import Routers from "../Routers/Routers";
import FeedbackComponent from "../Feedback/FeedbackComponent";
import Navbar from "../Header/Navbar";

function Layout() {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: 80 }}>
        <Routers />
      </div>
      <FeedbackComponent />
    </div>
  );
}

export default Layout;
