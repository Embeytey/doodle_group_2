import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const Logout = () => {
  const { logout, unsetUserDetail } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://127.0.0.1:8000/api/auth/logout/")
      .then((response) => {})
      .catch((error) => {})
      .finally(() => {
        logout();
        // unsetUserDetail();
        navigate("/");
      });
  }, []);

  return <div></div>;
};

export default Logout;
