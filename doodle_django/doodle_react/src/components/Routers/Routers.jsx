import "../../App.css";
// import "./index.css";
import Navbar from "../../pages/Navbar";
import Welcome from "../../pages/Welcome";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Creation from "../../pages/Creation";
import Manage from "../../pages/Manage";
import Dashboard from "../../pages/Dashboard";
import Preference from "../../pages/Preference";
import Register from "../Login/Regsiter";
import Login from "../Login/Login";
import Logout from "../Login/Logout";
import User from "../../pages/User";
import ProtectedRoute from "./ProtectedRoute";
import {isUserAuthenticated, getUserInfo} from "../Login/Utils";

function Routers() {
  const token = sessionStorage.getItem("token");

  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" name="Home" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={isUserAuthenticated()}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={isUserAuthenticated()}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={!isUserAuthenticated()}>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={!isUserAuthenticated()}>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<Creation />} />
        <Route path="/manage/:meetingId" element={<Manage />} />
        <Route path="/preference" element={<Preference />} />
        <Route path="/user/:uuid" element={<User />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default Routers;
