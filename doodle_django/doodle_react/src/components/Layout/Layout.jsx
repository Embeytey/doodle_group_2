import React from "react";
import Header from "../Header/Header";
import Routers from "../Routers/Routers";
import useState from "react";
import FeedbackComponent from "../Feedback/FeedbackComponent";
import Navbar from "../Header/Navbar";

function Layout(isLoggedIn) {
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
