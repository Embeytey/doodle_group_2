import React, { useState } from "react";

import { Box, Card, TextField, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Register = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const handleSubmitRegister = async () => {
    console.log(data);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auth/registration/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      navigate("/dashboard");

      sessionStorage.setItem("key", response.data.key);
      console.log(response.data.key);

      console.log(response);
    } catch (error) {
      console.log(error);
      alert(error.response.data.non_field_errors);
    }
  };

  const handleInputChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const btnstyle = { margin: "8px 0px" };
  return (
    <div className="login">
      <h2>Register to book appointment</h2>
      <Card sx={{ maxWidth: 450, marginTop: 5 }} elevation={0} display="flex">
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
          label="Email"
          placeholder="Enter Email"
          variant="outlined"
          fullWidth
          required
          name="email"
          value={data.email}
          onChange={handleInputChange}
        />
        <Box sx={{ m: "2rem" }} />
        <TextField
          label="Password"
          name="password1"
          placeholder="Enter password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={data.password1}
          onChange={handleInputChange}
        />
        <Box sx={{ m: "2rem" }} />
        <TextField
          label="Confirm Password"
          name="password2"
          placeholder="Enter confirm password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={data.password2}
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
            onClick={handleSubmitRegister}>
            Register
          </Button>
          <Box sx={{ m: "1rem" }} />
          <Typography elevation={0}>
            {" "}
            Already have an account ? <Link to="/login">Login</Link>
          </Typography>
        </div>
      </Card>
    </div>
  );
};

export default Register;
