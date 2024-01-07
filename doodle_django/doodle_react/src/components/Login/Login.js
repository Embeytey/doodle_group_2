import React, { useState } from "react";
import {
  Box,
  Card,
  Input,
  TextField,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import "./login.css";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import axios from "axios";

const headers = {
  "Content-Type": "application/json",
};

const Login = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSubmitLogin = async () => {
    console.log(data);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auth/login/`,
        data,
        {
          headers: headers,
        }
      );

      console.log(response);
      const loggedInUser = response.data.user;
      sessionStorage.setItem("token", response.data.key);
      sessionStorage.setItem("isLoggedIn", true);
      // you can change the route path
      const getToken = await sessionStorage.getItem("token");
      console.log("hava token");
      console.log(getToken);
      if (getToken == "") {
        console.log("IM booking");
        navigate("/create");
      } else {
        navigate("/", { state: { loggedInUser } });
      }
    } catch (error) {
      console.log(error);

      alert(error.response.data.non_field_errors);
    }
  };

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

  const btnstyle = { margin: "8px 0px", background: "#d1c3bb" };
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
        display="flex"
      >
        <Box sx={{ m: "1rem" }} />
        <TextField
          required
          label="Username"
          placeholder="Enter username"
          variant="outlined"
          fullWidth
          name="username"
          value={data.username}
          onChange={handleInputChange}
        />
        <Box sx={{ m: "2rem" }} />
        <TextField
          required
          label="Password"
          name="password"
          placeholder="Enter password"
          type="password"
          variant="outlined"
          fullWidth
          value={data.password}
          onChange={handleInputChange}
        />
        <Box sx={{ m: "2rem" }} />
        <div style={{ mx: 100 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            style={btnstyle}
            onClick={handleSubmitLogin}
          >
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
