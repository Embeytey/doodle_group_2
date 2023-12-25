import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../Login/AuthProvider";
import Welcome from "../../pages/Welcome";
import Creation from "../../pages/Creation";
import Manage from "../../pages/Manage";
import Dashboard from "../../pages/Dashboard";
import Preference from "../../pages/Preference";
import Register from "../Login/Regsiter";
import Login from "../Login/Login";
import Logout from "../Login/Logout";
import User from "../../pages/User";
import ProtectedRoute from "./ProtectedRoute";
import VotedPage from "../User/VotedPage";  
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

import FeedbackListPage from "../Feedback/FeedbackListPage";

function Routers() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/" name="Home" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={!isAuthenticated}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={!isAuthenticated}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={isAuthenticated}>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute redirectPath="/login" isAllowed={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/voted" exact component={VotedPage} />
        <Route path="/create" element={<Creation />} />
        <Route path="/manage/:meetingId" element={<Manage />} />
       
        <Route path="/feedback-list" element={<FeedbackListPage />} />
        
        <Route path="/user/:uuid" element={<User />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default Routers;
