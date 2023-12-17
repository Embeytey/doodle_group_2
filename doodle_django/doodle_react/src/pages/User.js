import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserContainer from "../components/User/UserContainer";
import Preference from "./Preference";

const User = () => {

  const {uuid} = useParams();

  console.log("uuid", uuid);

  const [data, setData] = useState([]);

  const getVotes = async () => {
    try {
      let url = `http://127.0.0.1:8000/api/votes/`;
      const meetingResponse = await axios.get(url, {params: {"link_token": uuid}});
      setData(meetingResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVotes();
  }, []);

  return (
    <div>
      <UserContainer data={data} />
    </div>
  );
};

export default User;
