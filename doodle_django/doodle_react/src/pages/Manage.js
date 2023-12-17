import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ManageMeetingContainer from "../components/ManageMeeting/ManageMeetingContainer";

const Manage = () => {

  const {meetingId} = useParams();

  const [data, setData] = useState({});

  const getMeeting = async () => {
    try {
      const passcode = JSON.parse(localStorage.getItem("created_meeting")).passcode;
      let url = `http://127.0.0.1:8000/api/meetings/${meetingId}/`;
      const meetingResponse = await axios.get(url, {params: {"passcode": passcode}});
      setData(meetingResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMeeting();
  }, []);

  return (
    <div>
      <ManageMeetingContainer data={data} />
    </div>
  );
};

export default Manage;
