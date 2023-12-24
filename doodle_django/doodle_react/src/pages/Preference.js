import PreferenceVoteContainer from "../components/PreferenceVote/PreferenceVoteContainer";
import news from "../news.json";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Preference = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const meetingId =
    searchParams.get("id") !== null ? searchParams.get("id") : -1;

  // console.log("FROM", meetingId);

  news.sort(() => Math.random() - 0.5);

  const [data, setData] = useState([]);

  const getMeeting = async () => {
    try {
      console.log("meetingID", meetingId);
      let url = "http://127.0.0.1:8000/api/meetings/";

      const response = await axios.get(url, {params:{link_token : data["link_token"]}});

      if (!response.ok) throw new Error("Meeting not found");

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

  return (
    <div>
      <PreferenceVoteContainer news={news} data={data} />
    </div>
  );
};

export default Preference;
