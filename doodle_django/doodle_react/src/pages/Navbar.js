import React from "react";
import {
  Toolbar,
  Avatar,
  Menu,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
  Typography,
} from "@mui/material";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import unical from "../components/images/unical.png";

function Navbar() {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  const settings = [
    { id: "1", title: "home", link: "/" },
    { id: "2", title: "Dashboard", link: "/dashboard" },
    {
      id: "3",
      title: isLoggedIn ? "Logout" : "Register",
      link: isLoggedIn ? "/logout" : "/register",
    },
    { id: "4", title: "/Feedback", link: "/feedback-list" },
  ];

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear token and any other user-related data
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    // Redirect to the home page
    window.location.href = "/";
  };
  return (
    <div className="navbar">
      <h1 style={{ color: "#00000 " }}>
        <img className="img" src={unical} alt="imag" />
        Doodle Unical
      </h1>
      <div className="profile">
        <Toolbar>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem
                  key={setting.id}
                  onClick={
                    setting.title === "Logout"
                      ? handleLogout
                      : handleCloseUserMenu
                  }>
                  <Link to={setting.link}>
                    <Typography textAlign="center">{setting.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
              {/* <Link to="/login">
                <Button>Login</Buttonmmm>
              </Link> */}
            </Menu>
          </Box>
        </Toolbar>
      </div>
    </div>
  );
}

export default Navbar;
