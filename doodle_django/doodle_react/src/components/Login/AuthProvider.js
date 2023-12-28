import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    axios.defaults.headers.common["Content-Type"] = "application/json";
    const isAuthState = JSON.parse(localStorage.getItem("isAuthenticated"));
    const userState = JSON.parse(localStorage.getItem("user"));
    const tokenState = JSON.parse(localStorage.getItem("token"));
    if (!!isAuthState) {
      setIsAuthenticated(isAuthState);
    }
    if (!!userState) {
      setUser(userState);
    }
    if(!!tokenState) {
      setToken(tokenState);
      console.log('token', tokenState);
      axios.defaults.headers.common["Authorization"] = `Token ${tokenState}`;
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('token', JSON.stringify(token));
  }, [token]);

  const login = (key) => {
    axios.defaults.headers.common["Authorization"] = `Token ${key}`;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    setIsAuthenticated(true);
    setToken(key);

    axios
      .get(`http://127.0.0.1:8000/api/user-info/`)
      .then((response) => {
        setUserDetail(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = () => {
    axios.defaults.headers.common["Authorization"] = null;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const setUserDetail = (detail) => {
    setUser(detail);
  };

  const unsetUserDetail = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, setUserDetail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
