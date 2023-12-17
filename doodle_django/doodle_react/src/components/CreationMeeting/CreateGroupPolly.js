import * as React from "react";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import "./createGroupPolly.css";
import News from "./News";
import CreateGroup from "./CreateGroup.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import PrimaryButton from "../Utils/PrimaryButton.js";

const CreateGroupPolly = ({ news }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState([
    "09:00",
    "10:00",
  ]);

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const durationInMilliseconds = end - start;

    const pad = (num) => num.toString().padStart(2, "0");

    const hours = pad(Math.floor(durationInMilliseconds / 3600000));
    const minutes = pad(Math.floor((durationInMilliseconds % 3600000) / 60000));
    const seconds = pad(Math.floor((durationInMilliseconds % 60000) / 1000));

    return `${hours}:${minutes}:${seconds}`;
  };

  const handleDateClick = (value) => {
    const dateIndex = selectedDates.findIndex(
      (dateObj) => dateObj.date.toDateString() === value.toDateString()
    );
    if (dateIndex > -1) {
      const updatedDates = selectedDates.filter(
        (dateObj) => dateObj.date.toDateString() !== value.toDateString()
      );
      setSelectedDates(updatedDates);
    } else {
      setSelectedDates((prevDates) => [
        ...prevDates,
        { date: value, timeRange: [...selectedTimeRange] },
      ]);
    }
  };

  const handleTimeChange = (time, index) => {
    setSelectedTimeRange((prevTimeRange) => {
      const updatedTimeRange = [...prevTimeRange];
      updatedTimeRange[index] = time;
      return updatedTimeRange;
    });
  };

  const [video, setVideo] = useState("Zoom");

  const updateVideo = (newVideo) => {
    setVideo(newVideo);
  };

  const [checked, setChecked] = React.useState(false);

  const updateCheck = (event) => {
    setChecked(event.target.checked);
  };

  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
  });

  const [error, setError] = useState({
    title: false,
    date: false,
  });

  let navigate = useNavigate();

  const titleError = () => {
    setError((prevErrors) => ({
      ...prevErrors,
      ["title"]: true,
    }));
    const element = document.getElementById("title_form");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const checkRequirements = () => {
    let bool = true;
    if (data.title === "") {
      titleError();
      bool = false;
    }
    if (selectedDates.length === 0) {
      setError((prevErrors) => ({
        ...prevErrors,
        ["date"]: true,
      }));
      bool = false;
    }
    return bool;
  };

  const deleteFields = () => {
    setChecked(false);
  };

  const formatDeadline = (deadline) => {
    const year = deadline.getFullYear();
    const month = (deadline.getMonth() + 1).toString().padStart(2, "0");
    const day = deadline.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleApi = async (e) => {
    e.preventDefault();

    if (selectedDates.length === 0) {
      console.error("No dates selected");
      return;
    }

    const startDate = selectedDates[0].date.toISOString().split("T")[0];
    const deadline = formatDeadline(
      selectedDates[selectedDates.length - 1].date
    );

    let array_time_slots = [];
    for (let i = 0; i < selectedDates.length; ++i) {
      const newDate = new Date(selectedDates[i].date);
      newDate.setDate(selectedDates[i].date.getDate() + 1);

      const startDate = newDate.toISOString().split("T")[0];
      const startTime = selectedDates[i].timeRange[0];
      const startDateTime = `${startDate}T${startTime}:00`;

      const endDate = newDate.toISOString().split("T")[0];
      const endTime = selectedDates[i].timeRange[1];
      const endDateTime = `${endDate}T${endTime}:00`;

      // console.log("Selected date", endDate);

      array_time_slots.push({
        start_date: startDateTime,
        end_date: endDateTime,
      });
    }
    const startTime = selectedTimeRange[0];
    const endTime = selectedTimeRange[1];
    const duration = calculateDuration(startTime, endTime);

    let data = {
      title: data.title,
      description: data.description,
      location: data.location,
      duration: duration,
      video_conferencing: checked,
      start_date: startDate,
      deadline: deadline,
      timeslots: array_time_slots,
    };
    try {
      const meetingResponse = await axios.post(
        "http://127.0.0.1:8000/api/meetings/",
        data
      );
      const meetingDetail = {
        id: meetingResponse.data.id,
        passcode: meetingResponse.data.passcode,
        link: meetingResponse.data.link,
      };
      localStorage.setItem("created_meeting", JSON.stringify(meetingDetail));
      navigate(`/manage/${meetingResponse.data.id}`);
      deleteFields();
    } catch (e) {}
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (checkRequirements()) {
      handleApi(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setError((prevErrors) => ({
        ...prevErrors,
        [name]: false,
      }));
    }
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onExpand = (index) => {
    const btn = document.getElementsByClassName("field");
    if (index === 0) btn[0].style.marginBottom = "100px";
    else btn[1].style.paddingBottom = "180px";
  };

  const onContraction = (index) => {
    const btn = document.getElementsByClassName("field");
    if (index === 0) btn[0].style.marginBottom = "20px";
    else btn[1].style.paddingBottom = "0px";
  };

  return (
    <div id="CreateGroupPolly" className="main_grid">
      <Grid container spacing={2}>
        <Grid className="sx_news" item xs={2}>
          <News news={news} start={0} numberOfDivsNews={3} />
        </Grid>
        <Grid className="middle_grid" item xs={8}>
          <div className="field">
            <CreateGroup
              data={data}
              setData={handleInputChange}
              onContraction={onContraction}
              error={error}
              onExpand={onExpand}
              video={video}
              setVideo={updateVideo}
              checked={checked}
              setChecked={updateCheck}
            />
          </div>
          <div className="field" style={{ paddingTop: 15 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6}>
                <div className="calendar-section">
                  <div style={{ flex: 1 }}>
                    <h1>Add time</h1>
                  </div>
                  <Calendar
                    onClickDay={(value) => handleDateClick(value)}
                    value={selectedDates.map((dateObj) => dateObj.date)}
                  />
                </div>
              </Grid>
              <Grid item md={6}>
                <div style={{ flex: 1 }}>
                  <h2>Selected Dates:</h2>
                  {/* Rest of your code */}
                  <div className="time-range-section">
                    <h2>Select Time Range:</h2>
                  </div>
                  <div>
                    <TimePicker
                      style={{ backgroundColor: "white", color: "#757575" }}
                      onChange={(time) => handleTimeChange(time, 0)}
                      value={selectedTimeRange[0]}
                      className="custom-time-picker"
                    />
                    <p>Start Time: {selectedTimeRange[0]}</p>
                  </div>
                  <div>
                    <TimePicker
                      style={{ backgroundColor: "white", color: "#757575" }}
                      onChange={(time) => handleTimeChange(time, 1)}
                      value={selectedTimeRange[1]}
                      className="custom-time-picker"
                    />
                    <p>End Time: {selectedTimeRange[1]}</p>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div
            style={{
              textAlign: "end",
              marginBottom: 20,
              marginRight: 20,
              marginTop: 20,
            }}>
            <PrimaryButton
              text={"Create Invate and Continue"}
              functionOnClick={handleButtonClick}
              style={{ margin: 20, textAlign: "end" }}
              variant="contained"
              type="submit"
            />
          </div>
        </Grid>
        <Grid className="dx_news" item xs={2}>
          <News news={news} start={3} numberOfDivsNews={6} />
        </Grid>
      </Grid>
    </div>
  );
};

export default CreateGroupPolly;
