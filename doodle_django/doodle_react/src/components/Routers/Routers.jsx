import { Routes, Route } from "react-router-dom";
import Welcome from "../../pages/Welcome";
import React from "react";
import Creation from "../../pages/Creation";
import Manage from "../../pages/Manage";
import Dashboard from "../../pages/Dashboard";
import Preference from "../../pages/Preference";
import Register from "../Login/Regsiter";
import Login from "../Login/Login";
import Logout from "../Login/Logout";
import User from "../../pages/User";
import ProtectedRoute from "./ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

function Routers() {
  const token = sessionStorage.getItem("token");

  return (
    <div>
      <Routes>
        <Route path="/" name="Home" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={!token}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={!token}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute redirectPath="/" isAllowed={true}>
              <Logout />
            </ProtectedRoute>
          }
        />
        <Route path="/create" element={<Creation />} />
        <Route path="/manage/:meetingId" element={<Manage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preference" element={<Preference />} />
        <Route path="/user/:uuid" element={<User />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </div>
  );
}

export default Routers;
