import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    axios.post(
      "http://127.0.0.1:8000/api/auth/logout/"
      ).then(response => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }).catch(error => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      }).finally(() => {
        navigate("/");
      });
  }, []);

  const navigate = useNavigate();


  return <div></div>;
};

export default Logout;
