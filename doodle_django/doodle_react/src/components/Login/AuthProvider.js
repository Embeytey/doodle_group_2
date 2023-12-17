import React, { createContext, useState, useContext } from 'react';
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (key) => {
    axios.defaults.headers.common["Authorization"] = `Token ${key}`;
    setIsAuthenticated(true);

    axios.get(`http://127.0.0.1:8000/api/user-info/`)
      .then((response) => {
        setUserDetail(response.data);})
      .catch((error) => {
        console.log(error);}
      );
  };

  const logout = () => {
    axios.defaults.headers.common["Authorization"] = null;
    setIsAuthenticated(false);
  };

  const setUserDetail = (detail) => {
    setUser(detail);
  }

  const unsetUserDetail = () => {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUserDetail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};