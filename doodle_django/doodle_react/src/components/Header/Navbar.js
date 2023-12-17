import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  useScrollTrigger,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import unical from "../images/unical.png";
import "../../index.css";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const trigger = useScrollTrigger();
  const location = useLocation();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  const getUserInfo = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user ? user.username : null;
  };

  const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
  };

  const username = getUserInfo();

  return (
    <AppBar
      position="fixed"
      sx={{
        background: "#867770",
        borderBottom: "1px solid #59483e",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: trigger ? "opacity(80%)" : "none",
        "& a": {
          textDecoration: "none",
          color: "inherit",
        },
      }}>
      <Toolbar style={{ height: 80 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            marginLeft: 2,
          }}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img
              style={{
                maxWidth: 40,
                marginRight: 10,
              }}
              src={unical}
              alt="unical"
            />
            <Typography variant="h6">Doodle Meeting</Typography>
          </Link>
        </Box>
        <Box sx={{ display: "flex", marginRight: 15 }}>
          {location.pathname !== "/create" && (
            <Link to="/create">
              <Button color="inherit">Create</Button>
            </Link>
          )}
          {location.pathname !== "/dashboard" && (
            <Link to="/dashboard">
              <Button color="inherit">Dashboard</Button>
            </Link>
          )}
        </Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuOpen}>
          <AccountCircleIcon style={{ marginRight: 3 }} />
          {isAuthenticated ? username : <p style={{ margin: 0 }}>Guest</p>}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}>
          {isAuthenticated ? (
            <MenuItem onClick={handleMenuClose}>
              <Link to="/logout" style={linkStyle}>
                Logout
              </Link>
            </MenuItem>
          ) : (
            <>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/login" style={linkStyle}>
                  Login
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link to="/register" style={linkStyle}>
                  Registration
                </Link>
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
