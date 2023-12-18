import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ManageMeetingContainer from "../components/ManageMeeting/ManageMeetingContainer";

const Manage = () => {
  const { meetingId } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    console.log("MANAGE");

    let url = `http://127.0.0.1:8000/api/meetings/${meetingId}/`;
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <div>{data && <ManageMeetingContainer data={data} />}</div>;
};

export default Manage;
