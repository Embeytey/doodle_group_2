import React from "react";
import Routers from "../Routers/Routers";
import FeedbackComponent from "../Feedback/FeedbackComponent";
import Header from "../Header/Header";

function Layout() {
  return (
    <div>
      <Header />
      <div style={{ marginTop: 80 }}>
        <Routers />
      </div>
      <FeedbackComponent />
    </div>
  );
}

export default Layout;
