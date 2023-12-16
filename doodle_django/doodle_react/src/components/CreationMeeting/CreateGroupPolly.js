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

  const tileDisabled = ({ date, view }) =>
    view === "month" && date < new Date();

  const [error, setError] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [title, setTitle] = useState("");

  const updateTitle = (newTitle) => {
    setTitle(newTitle);
    if (newTitle !== "") setError(false);
  };

  const [description, setDescription] = useState("");

  const updateDescription = (newDescription) => {
    setDescription(newDescription);
  };

  const [location, setLocation] = useState("");

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  const [video, setVideo] = useState("Zoom");

  const updateVideo = (newVideo) => {
    setVideo(newVideo);
  };

  const [checked, setChecked] = React.useState(false);

  const updateCheck = (event) => {
    setChecked(event.target.checked);
  };

  let navigate = useNavigate();

  const getToken = () => sessionStorage.getItem("token");

  const titleError = () => {
    setError(true);
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
    if (title === "") {
      titleError();
      bool = false;
    }
    if (selectedDates.length === 0) {
      setErrorDate(true);
      bool = false;
    }
    return bool;
  };

  const deleteFields = () => {
    updateTitle("");
    setChecked(false);
    updateDescription("");
    updateLocation("");
    updateVideo("");
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
      title: title,
      description: description,
      location: location,
      duration: duration,
      video_conferencing: checked,
      start_date: startDate,
      deadline: deadline,
      timeslots: array_time_slots,
    };
    try {
      await axios.post("http://127.0.0.1:8000/api/meetings/new/", data, {
        headers: {
          authorization: `Token ${getToken()}`,
        },
      });
      // alert("Meeting Created successfully!");
      navigate("/manage");
      deleteFields();
    } catch (e) {}
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (checkRequirements()) {
      handleApi(e);
    }
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
              title={title}
              setTitle={updateTitle}
              description={description}
              setDescription={updateDescription}
              location={location}
              setLocation={updateLocation}
              video={video}
              onContraction={onContraction}
              setVideo={updateVideo}
              checked={checked}
              setChecked={updateCheck}
              error={error}
              onExpand={onExpand}
            />
          </div>
          <div className="field">
            <div style={{ display: "flex" }}>
              <div className="container">
                <div className="calendar-section">
                  <div style={{ flex: 1 }}>
                    <h1>Add time</h1>
                  </div>
                  <Calendar
                    onClickDay={(value) => handleDateClick(value)}
                    value={selectedDates.map((dateObj) => dateObj.date)}
                    tileDisabled={tileDisabled}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h2>Selected Dates:</h2>
                  {selectedDates.length > 0 ? (
                    <ul>
                      {selectedDates.map((dateObj, index) => (
                        <li key={index}>
                          {dateObj.date.toDateString()} from{" "}
                          {dateObj.timeRange[0]} to {dateObj.timeRange[1]}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>
                      {!errorDate && (
                        <p className="no_error">No dates selected</p>
                      )}
                      {errorDate && <p className="error">No dates selected</p>}
                    </div>
                  )}
                  <div>
                    <div div className="time-range-section">
                      <h2>Select Time Range:</h2>
                    </div>
                    <div>
                      <TimePicker
                        style={{ color: "#757575" }}
                        onChange={(time) => handleTimeChange(time, 0)}
                        value={selectedTimeRange[0]}
                        className="custom-time-picker"
                      />
                      <p>Start Time: {selectedTimeRange[0]}</p>
                    </div>
                    <div>
                      <TimePicker
                        style={{ color: "#757575" }}
                        onChange={(time) => handleTimeChange(time, 1)}
                        value={selectedTimeRange[1]}
                        className="custom-time-picker"
                      />
                      <p>End Time: {selectedTimeRange[1]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                textAlign: "end",
                marginBottom: 20,
                marginRight: 20,
                marginTop: 20,
              }}
            >
              <PrimaryButton
                text={"Create Invate and Continue"}
                functionOnClick={handleButtonClick}
                style={{ margin: 20, textAlign: "end" }}
                variant="contained"
                type="submit"
              />
            </div>
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
