import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  TextField,
  Grid,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
} from "@mui/material";
import "./login.css";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import PrimaryButton from "../Utils/PrimaryButton.js";

const headers = {
  "Content-Type": "application/json",
};

const Regsiter = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [error, setError] = useState({
    username: false,
    email: false,
    password1: false,
    password2: false,
  });

  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$"
  );

  const checkRequirements = () => {
    let bool = true;
    const errors = {};
    if (data.username === "") {
      errors.username = true;
      bool = false;
    }
    if (!validEmail.test(data.email)) {
      errors.email = true;
      bool = false;
    }
    if (data.password1 === "") {
      errors.password1 = true;
      bool = false;
    }
    if (data.password2 === "") {
      errors.password2 = true;
      bool = false;
    }
    if (data.password1 !== data.password2) {
      errors.password2 = true;
      bool = false;
    }
    setError((prevErrors) => ({ ...prevErrors, ...errors }));
    return bool;
  };

  const handleSubmitRegister = async () => {
    if (checkRequirements()) {
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
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div id="CreateGroupPolly" className="main_grid">
        <Grid container spacing={2}>
          <Grid item xs={4}></Grid>
          <Grid className="middle_grid" item xs={4}>
            <div className="field">
              <div className="CreateGroup">
                <h2 style={{ paddingTop: 30 }}>Register to book appointment</h2>
                <Box
                  className="fieldCreateGroup"
                  component="form"
                  sx={{
                    "& .MuiTextField-root": {
                      marginBottom: 4,
                      marginRight: 2,
                      width: "-webkit-fill-available",
                    },
                    "& .MuiFormHelperText-root": {
                      color: "red",
                    },
                  }}
                  noValidate
                  autoComplete="off">
                  <div className="form_creation">
                    <TextField
                      required
                      helperText={
                        error.username ? "You have to provide an username" : ""
                      }
                      error={error.username}
                      id="username-outlined-required"
                      label="Username"
                      name="username"
                      value={data.username}
                      style={{
                        backgroundColor: "white",
                      }}
                      onChange={handleInputChange}
                      InputLabelProps={{
                        style: {
                          fontFamily: "Quicksand",
                        },
                      }}
                    />
                  </div>
                  <div className="form_creation">
                    <TextField
                      required
                      helperText={
                        error.email ? "You have to provide a valid email" : ""
                      }
                      error={error.email}
                      id="email-outlined-required"
                      label="Email"
                      name="email"
                      value={data.email}
                      style={{
                        backgroundColor: "white",
                      }}
                      onChange={handleInputChange}
                      InputLabelProps={{
                        style: {
                          fontFamily: "Quicksand",
                        },
                      }}
                    />
                  </div>
                  <div className="form_creation" style={{ paddingRight: 25 }}>
                    <FormControl
                      sx={{
                        width: "-webkit-fill-available",
                        backgroundColor: "white",
                      }}
                      variant="outlined"
                      error={error.password1}>
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        style={{
                          color: error.password1 ? "#d32f2f" : undefined,
                        }}>
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={data.password1}
                        name="password1"
                        onChange={handleInputChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              color={error.password1 ? "error" : "default"}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        error={error.password1}
                      />

                      {error.password1 && (
                        <p
                          className="MuiFormHelperText-root"
                          style={{
                            color: "#d32f2f",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            lineHeight: 1.66,
                            letterSpacing: "0.03333em",
                            textAlign: "left",
                            marginTop: 3,
                            marginRight: 14,
                            marginBottom: 0,
                            marginLeft: 14,
                          }}>
                          Password is required
                        </p>
                      )}
                    </FormControl>
                  </div>
                  <div
                    className="form_creation"
                    style={{ paddingRight: 25, marginTop: 30 }}>
                    <FormControl
                      sx={{
                        width: "-webkit-fill-available",
                        backgroundColor: "white",
                      }}
                      variant="outlined"
                      error={error.password2}>
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        style={{
                          color: error.password2 ? "#d32f2f" : undefined,
                        }}>
                        Confirm Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={data.password2}
                        name="password2"
                        onChange={(e) => handleInputChange(e)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              color={error.password2 ? "error" : "default"}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        error={error.password2}
                      />

                      {error.password2 && (
                        <p
                          className="MuiFormHelperText-root"
                          style={{
                            color: "#d32f2f",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                            lineHeight: 1.66,
                            letterSpacing: "0.03333em",
                            textAlign: "left",
                            marginTop: 3,
                            marginRight: 14,
                            marginBottom: 0,
                            marginLeft: 14,
                          }}>
                          Confirm Password is missing or doesn't match with
                          password
                        </p>
                      )}
                    </FormControl>
                  </div>
                </Box>
              </div>
              <div
                style={{
                  textAlign: "end",
                  marginBottom: 20,
                  marginRight: 20,
                  marginTop: 20,
                }}>
                <PrimaryButton
                  text={"Register"}
                  functionOnClick={handleSubmitRegister}
                  style={{ margin: 20, textAlign: "end" }}
                  variant="contained"
                  type="submit"
                />
                <p style={{ textAlign: "end", marginTop: 10 }}>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#59483e",
                      textDecoration: "none",
                      fontWeight: 800,
                    }}>
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Regsiter;
