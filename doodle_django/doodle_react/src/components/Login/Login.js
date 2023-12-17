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

const Login = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState({
    username: false,
    password: false,
  });

  const checkRequirements = () => {
    let bool = true;
    if (data.username === "") {
      setError((prevErrors) => ({
        ...prevErrors,
        ["username"]: true,
      }));
      bool = false;
    }
    if (data.password === "") {
      setError((prevErrors) => ({
        ...prevErrors,
        ["password"]: true,
      }));
      bool = false;
    }
    return bool;
  };

  const handleSubmitLogin = async () => {
    if (checkRequirements()) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/auth/login/`,
          data,
          {
            headers: headers,
          }
        );
        sessionStorage.setItem("token", response.data.key);
        axios.defaults.headers.common["Authorization"] =
          "Token " + sessionStorage.getItem("token");
        const user_res = await axios.get(
          `http://127.0.0.1:8000/api/user-info/`
        );
        sessionStorage.setItem("user", JSON.stringify(user_res.data));
        navigate("/");
      } catch (error) {
        alert(error);
        console.log(error);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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

  return (
    <div>
      <div id="CreateGroupPolly" className="main_grid">
        <Grid container spacing={2}>
          <Grid item xs={4}></Grid>
          <Grid className="middle_grid" item xs={4}>
            <div className="field">
              <div className="CreateGroup">
                <h2 style={{ paddingTop: 30 }}>Login for Doodle Unical</h2>
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
                      onChange={(e) => handleInputChange(e)}
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
                      error={error.password}>
                      <InputLabel
                        htmlFor="outlined-adornment-password"
                        style={{
                          color: error.password ? "#d32f2f" : undefined,
                        }}>
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        value={data.password}
                        onChange={(e) => handleInputChange(e)}
                        name="password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end">
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                        error={error.password}
                      />

                      {error.password && (
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
                  text={"Login"}
                  functionOnClick={handleSubmitLogin}
                  style={{ margin: 20, textAlign: "end" }}
                  variant="contained"
                  type="submit"
                />
                <p style={{ textAlign: "end", marginTop: 10 }}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#59483e",
                      textDecoration: "none",
                      fontWeight: 800,
                    }}>
                    Register
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

export default Login;
