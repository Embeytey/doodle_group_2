import UserContainer from "../components/User/UserContainer";
import news from "../news.json";
import { useState, useEffect, useParam } from "react";
import { useLocation } from "react-router-dom";
import Preference from "./Preference";
import axios from "axios";

const User = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { uuid } = useParam();

  const meetingId =
    searchParams.get("id") !== null ? searchParams.get("id") : -1;

  news.sort(() => Math.random() - 0.5);

  const [data, setData] = useState([]);

  const getMeeting = async () => {
    try {
      console.log("meetingID", meetingId);
      let url = "http://127.0.0.1:8000/api/meetings/";

      const response = await axios.get(url, { params: { link_token: uuid } });
      console.log("USER", response.data);
      setData(response.data[0]);

      // if (!response.ok) throw new Error("Meeting not found");

      const local_data = await response.json();
      var length = Object.keys(local_data).length;

      // console.log("meetingId", meetingId)

      if (meetingId !== -1) {
        for (let i = 0; i < local_data.length; ++i) {
          // console.log("Confronto id:", local_data[i].id, meetingId);
          if (String(local_data[i].id) === String(meetingId)) {
            setData(local_data[i]);
            return;
          }
        }
      }
      setData(local_data[length - 1]);
    } catch (error) {}
  };

  useEffect(() => {
    getMeeting();
  }, []);

  return data && <UserContainer news={news} data={data} />;
};

export default User;
