import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Box, Card, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const Login = () => {
  const { login } = useAuth();

  const handleSubmitLogin = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auth/login/`,
        data
      );
      login(response.data.key);
      console.log(response.data.key);
      // sessionStorage.addItem("token");
      navigate("/");
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const handleInputChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const btnstyle = { margin: "8px 0px" };

  return (
    <div className="login">
      <h2> Login for Doodle Unical</h2>

      <Card
        sx={{
          maxWidth: 400,
          marginTop: 1,
          background: "#d1c3bb",
          maxHeight: 300,
          marginLeft: 2,
        }}
        elevation={0}
        display="flex">
        <Box sx={{ m: "1rem" }} />
        <TextField
          label="Username"
          placeholder="Enter username"
          variant="outlined"
          fullWidth
          required
          name="username"
          value={data.username}
          onChange={handleInputChange}
        />
        <Box sx={{ m: "2rem" }} />
        <TextField
          label="Password"
          name="password"
          placeholder="Enter password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={data.password}
          onChange={handleInputChange}
        />
        <Box sx={{ m: "2rem" }} />
        <div style={{ mx: 100 }}>
          <Button
            type="submit"
            color="grey"
            variant="contained"
            size="large"
            fullWidth
            style={btnstyle}
            onClick={handleSubmitLogin}>
            Login
          </Button>
          <Box sx={{ m: "1rem" }} />
          <Typography elevation={0}>
            {" "}
            Don't have an account ? <Link to="/register">Register</Link>
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default Login;
