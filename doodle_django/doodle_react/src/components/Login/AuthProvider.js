import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const isAuthState = localStorage.getItem(isAuthenticated);
    const userState = localStorage.getItem(user);
    if (isAuthState) {
      setIsAuthenticated(JSON.parse(isAuthState));
    }
    if (userState) {
      setUser(userState);
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const login = (key) => {
    axios.defaults.headers.common["Authorization"] = `Token ${key}`;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    setIsAuthenticated(true);

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
