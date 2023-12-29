import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ManageMeeting from "../ManageMeeting/ManageMeeting";
import TableMeeting from "../ManageMeeting/TableMeeting";
import PrimaryButton from "../Utils/PrimaryButton";
import "../CreationMeeting/createGroup.css";
import "../CreationMeeting/createGroupPolly.css";
import "../ManageMeeting/manage.css";
import "../Utils/CopyableLink";
import CopyableLink from "../Utils/CopyableLink";

const ManageMeetingContainer = ({ data }) => {

  const navigate = useNavigate();

  const submitForm = async () => {
    let timeslot_id = null;
    //select timeslot
    if (selectedColumn !== undefined && selectedColumn !== "")
      timeslot_id = data["time_slots"][selectedColumn - 1]["id"];
    else navigate("/dashboard");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/book/" + data["id"] + "/",
        {
          final_date: timeslot_id,
        },
      );
      alert("Timeslot booked!");
      navigate("/dashboard");
    } catch (e) {}
  };

  const [selectedColumn, setSelectedColumn] = useState();

  useEffect(() => {
    if (data["final_date"] !== null && data["time_slots"]) {
      for (let i = 0; i < data["time_slots"].length; ++i) {
        if (data["final_date"] === data["time_slots"][i]["id"]) {
          setSelectedColumn(i + 1);
          return;
        }
      }
    }
  }, [data]);

  const columnSelection = (columnName) => {
    if (columnName !== 0) {
      if (selectedColumn === columnName) {
        setSelectedColumn("");
      } else {
        setSelectedColumn(columnName);
      }
    }
  };

  return (
    <div id="CreateGroup" className="main_grid">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid className="sx_news" item xs={3}></Grid>
          <Grid style={{ paddingLeft: 0 }} item xs={6}>
            <div className="field">
              <ManageMeeting data={data} />
            </div>
            <div className="field">
              <TableMeeting
                data={data}
                style={{paddingTop: '10vh'}}
                selectedColumn={selectedColumn}
                columnSelection={columnSelection}
              />
              <div
                style={{
                  marginRight: 20,
                  paddingBottom: 20,
                  paddingTop: 20,
                  textAlign: "end",
                }}>
                <PrimaryButton
                  text="Book it"
                  style={{ textAlign: "end" }}
                  functionOnClick={submitForm}
                  variant="contained"
                />
              </div>
            </div>
          </Grid>
          <Grid className="dx_news" item xs={3}>
            {/* <News news={news} start={3} numberOfDivsNews={6} /> */}
          </Grid>
          <Grid container justifyContent="center" alignItems="center">
            <Grid paddingRight="1vw">
              <p>Share this link with partecipants to let them vote!</p>
            </Grid>
            <Grid>
              {data && <CopyableLink path={ 'user/' + data.link_token} />}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ManageMeetingContainer;
