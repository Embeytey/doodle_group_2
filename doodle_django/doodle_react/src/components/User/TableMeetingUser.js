import React, { useState, useEffect } from "react";
import user from "../images/user.png";
import "../ManageMeeting/manage.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import axios from "axios";

const TableMeetingUser = ({
  selectedColumn,
  columnSelection,
  data,
  onSubmit,
  
  checkboxValues,  // Pass checkboxValues as a prop
  setCheckboxValues,
  viewList,
  
}) => {
  console.log("viewList:", viewList);
  
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[600]),
    backgroundColor: grey[600],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));
  const time_slots = Array.isArray(data["time_slots"])
    ? data["time_slots"]
    : [];

  console.log("Data:", data);
  //console.log("Time Slots:", data["time_slots"]);
  const handleCheckboxToggle = (index) => {
    if (!viewList) {
      setCheckboxValues((prevValues) => {
        const newValues = [...prevValues];
        const currentValue = newValues[index];
  
        // Toggle checkbox value
        newValues[index] =
          currentValue === false ? true : currentValue === true ? "maybe" : false;
  
        return newValues;
      });
    }
    // Construct the selectedDates array based on checkbox values
    const newSelectedDates = time_slots.map((time_slot, i) => ({
      start_date: time_slot.start_date,
      end_date: time_slot.end_date,
      preference:
        checkboxValues[i] === true
          ? "yes"
          : checkboxValues[i] === "maybe"
          ? "maybe"
          : "no",
    }));

    setSelectedDates(newSelectedDates);
  };
  
  const [selectedDates, setSelectedDates] = useState(time_slots);

  const handleSubmit = async () => {
    if (!viewList) {
      const preferences = {
        link_token: data["link_token"],
        votes: selectedDates.map((time_slot, index) => ({
          time_slot: {
            start_date: time_slot.start_date,
            end_date: time_slot.end_date,
          },
          preference:
            checkboxValues[index] === true
              ? "yes"
              : checkboxValues[index] === "maybe"
              ? "maybe"
              : "no",
        }))
      };

      console.log("Submitting Preferences:", preferences);

      try {
        const response = await axios.post("http://localhost:8000/api/votes/", preferences);

        if (response.status === 201 || response.status === 200) {
          // Success
          console.log("Preferences submitted successfully!");
          onSubmit(true);
        } else {
          console.error("Failed to submit preferences. Status:", response.status, "Data:", response.data);
        }
      } catch (error) {
        console.error("Error submitting preferences:", error);
      }
    }
    
  };
  
  return (
    <div>
      <table
        id="table_meeting"
        style={{
          border: "3px solid #f5f5f5",
          borderRadius: "8px",
          width: "-webkit-fill-available",
          marginRight: "15px",
          marginLeft: "15px",
        }}>
        <thead>
          <tr>
            {time_slots.map((value, index) => {
              const startDate = new Date(value["start_date"]);
              const endDate = new Date(value["end_date"]);

              // const startOptions = {
              //   year: "numeric",
              //   month: "numeric",
              //   day: "numeric",
              //   hour: "numeric",
              //   minute: "numeric",
              // };

              // const endOptions = {
              //   hour: "numeric",
              //   minute: "numeric",
              // };

              const formattedStartDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(new Date(value.start_date));

              const formattedEndDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }).format(new Date(value.end_date));

              return (
                <th
                  key={index}
                  style={{
                    position: "relative",
                    minWidth: "100px",
                    textAlign: "center",
                    marginLeft: "10px",
                  }}
                  onClick={() => columnSelection(index)}
                  className={selectedColumn === index ? "selected_column" : ""}>
                  <label key={index}>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}>
                      <p style={{ margin: "2px" }}>{formattedStartDate}</p>

                      <p style={{ margin: "2px" }}>{formattedEndDate}</p>
                    </div>
                    <div className="div_user">
                      <img src={user} alt="user" />
                      <nobr> 2</nobr>
                    </div>
                    <br />
                    <Checkbox
                      onChange={() => handleCheckboxToggle(index)}
                      sx={{
                        "& .MuiSvgIcon-root": { fontSize: 28 },
                        "&.Mui-checked": {
                          color: "green !important",
                        },
                        "&.Mui-indeterminate": {
                          color: "yellow !important",
                        },
                      }}
                      checked={checkboxValues[index] === true}
                      indeterminate={checkboxValues[index] === "maybe"}
                      style={{
                        backgroundColor: "transparent !important",
                        padding: "1px",
                        borderRadius: "1px",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                    <br />
                    <Checkbox disabled checked />
                  </label>
                </th>
              );
            })}
          </tr>
          <div
            style={{
              display: "flex",
              marginTop: "-65px",
              marginLeft: "0px",
              color: "black",
              fontWeight: "bold",
            }}>
            <span>You</span>
            <br />
          </div>
        </thead>
      </table>

      {/* Buttons for testing */}
      {!viewList && (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}>
      
      {/* {updatepreferncetest &&  <ColorButton
          style={{ margin: 20, textAlign: "end" }}
          onClick={handleSubmit}
          variant="contained">
          submit
        </ColorButton>
      } */}
      {/* <ColorButton
          style={{ margin: 20, textAlign: "end" }}
          onClick={handleSubmit}
          variant="contained">
          submit
        </ColorButton> */}
        
          <ColorButton
            style={{ margin: 20, textAlign: "end" }}
            onClick={handleSubmit}
            variant="contained"
          >
            submit
          </ColorButton>
        
      </div>
      )}
    </div>
  );
};

export default TableMeetingUser;
