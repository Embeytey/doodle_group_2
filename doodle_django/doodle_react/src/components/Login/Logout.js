import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useEffect } from 'react';


const Logout = () => {

  useEffect(() => {
    callLogout();
  }, []);

  const navigate = useNavigate();

  const callLogout = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/logout/'
      )
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      navigate("/");
    }
    catch (exception){
      alert(exception);
    }
  };

  return (
    <div></div>
  );
};

export default Logout;
