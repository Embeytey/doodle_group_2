import DashboardGrid from "../components/Dashboard/DashboardGrid";
import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState([]);

  const getMeeting = async () => {
    try {
      let url = "http://127.0.0.1:8000/api/meetings/";

      const response = await axios.get(url);

      if (response.status !== 200) throw new Error("Meeting not found");

      const local_data = await response.data;

      console.log(local_data[0]["time_slots"].length);

      setData(local_data);
    } catch (error) {}
  };

  useEffect(() => {
    getMeeting();
  }, []);

  return (
    <div>
      <DashboardGrid data={data} />
    </div>
  );
};

export default Dashboard;
