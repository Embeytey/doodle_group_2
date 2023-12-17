import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { useState } from "react";
import "../CreationMeeting/createGroupPolly.css";
import Grid from "@mui/material/Grid";

const OurCalendar = ({ selectedDates, setSelectedDates, errorDate }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState([
    "09:00",
    "10:00",
  ]);

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

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <div style={{ flex: 1 }}>
            <h1>Add time</h1>
            <Calendar
              onClickDay={(value) => handleDateClick(value)}
              value={selectedDates.map((dateObj) => dateObj.date)}
              tileDisabled={tileDisabled}
            />
          </div>
        </Grid>
        <Grid item md={6}>
          <div style={{ flex: 1, marginLeft: 20 }}>
            <h2>Selected Dates:</h2>
            {selectedDates.length > 0 ? (
              <ul>
                {selectedDates.map((dateObj, index) => (
                  <li key={index}>
                    {dateObj.date.toDateString()} from {dateObj.timeRange[0]} to{" "}
                    {dateObj.timeRange[1]}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                {!errorDate && <p className="no_error">No dates selected</p>}
                {errorDate && <p className="error">No dates selected</p>}
              </div>
            )}
            <div>
              <h2>Select Time Range:</h2>
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
        </Grid>
      </Grid>
    </div>
  );
};

export default OurCalendar;
