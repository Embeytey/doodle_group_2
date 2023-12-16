import React from "react";
import Header from "../Header/Header";
import Routers from "../Routers/Routers";
import useState from "react";

function Layout(isLoggedIn) {
  // const [isLoggedIn, setIsLoggedIn] = useState([false]);
  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <div style={{ marginTop: 80 }}>
        <Routers />
      </div>
    </div>
  );
}

export default Layout;
