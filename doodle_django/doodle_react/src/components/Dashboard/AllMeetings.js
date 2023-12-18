import "../ManageMeeting/manage.css";
import * as React from "react";
import SearchIcon from "@mui/icons-material/Search";
import calendar_icon from "../images/calendar_icon.png";
import profile from "../images/profile.png";
import trash from "../images/trash.png";
import { Link } from "react-router-dom";
import "./all_meeting.css";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import axios from "axios";
import { useCallback } from "react";
import debounce from "lodash/debounce";

const AllMeetings = ({ data }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchValue(String(value));
    }),
    []
  );

  const handleChange = (event) => {
    setSearchInput(event.target.value);
    handleSearchChange(event.target.value);
  };

  const [age, setAge] = React.useState("");

  const handleChangeMeeting = (event) => {
    setAge(event.target.value);
  };

  const deleteMeeting = async (id) => {
    try {
      let url = `http://127.0.0.1:8000/api/meetings/${id}/delete/`;
      await axios.delete(url);
      alert("Meeting deleted");
      window.location.reload();
    } catch (error) {}
  };

  const handleImageClick = (e, id) => {
    e.preventDefault();

    deleteMeeting(id);
  };

  return (
    <div className="field">
      <div
        style={{
          marginLeft: 5,
          textAlign: "left",
          marginTop: 0,
          padding: 10,
        }}>
        <div
          style={{ display: "inline-flex", width: "-webkit-fill-available" }}>
          <Grid
            container
            spacing={2}
            style={{ display: "flex", paddingTop: 0 }}>
            <Grid item s={3}>
              <h3>Meetings</h3>
            </Grid>
            <Grid item s={3}>
              {/* <FormControl sx={{ m: 1, width: "max-content" }}>
                <Select
                  style={{ color: "#757575", backgroundColor: "white" }}
                  value={age}
                  onChange={handleChangeMeeting}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}>
                  <MenuItem style={{ color: "#757575" }} value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem style={{ color: "#757575" }} value={1}>
                    Yours
                  </MenuItem>
                  <MenuItem style={{ color: "#757575" }} value={2}>
                    Others
                  </MenuItem>
                  <MenuItem style={{ color: "#757575" }} value={3}>
                    Confirmed
                  </MenuItem>
                </Select>
              </FormControl> */}
            </Grid>
            <Grid item s={6} style={{ marginLeft: "auto" }}>
              <div style={{ paddingRight: 10, paddingTop: 13 }}>
                <div className="search-container">
                  <div className="search">
                    <div className="search-icon">
                      <SearchIcon style={{ color: "#827066" }} />
                    </div>
                    <input
                      style={{ marginLeft: 5, marginBottom: 2, width: "80%" }}
                      type="text"
                      placeholder="Search…"
                      value={searchInput}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <div
        className="cardMeeting"
        style={{ paddingBottom: 5, marginLeft: 40, marginRight: 40 }}>
        {data
          .filter(
            (meeting) =>
              searchValue === "" ||
              meeting.title.toLowerCase().includes(searchValue.toLowerCase())
          )
          .map((meeting) => (
            <Link
              to={`/manage/${meeting.id}`}
              style={{ textDecoration: "inherit", color: "inherit" }}>
              <div className="card_meeting">
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={2}
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}>
                    <div>
                      <img
                        style={{ width: "20px", paddingLeft: 15 }}
                        src={profile}
                        alt="profile"
                      />
                    </div>
                  </Grid>
                  <Grid item xs={8}>
                    <div style={{ paddingLeft: 20 }}>
                      <h4
                        style={{
                          marginTop: 7,
                          textAlign: "start",
                          marginBottom: 7,
                        }}>
                        {meeting["title"]}
                      </h4>
                      <div className="all_meeting_div_img">
                        <img src={calendar_icon} alt="calendar_icon" />
                        <p>{meeting["time_slots"].length}</p>
                      </div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}>
                    <div
                      className="all_meeting_div_img"
                      style={{ textAlign: "end" }}>
                      <img
                        onClick={(e) => handleImageClick(e, meeting["id"])}
                        src={trash}
                        alt="trash"
                        style={{ paddingRight: 35 }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default AllMeetings;
