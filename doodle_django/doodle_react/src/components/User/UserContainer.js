import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import "../CreationMeeting/createGroup.css";
import "../CreationMeeting/createGroupPolly.css";
import "../ManageMeeting/manage.css";
import UserPreference from "../User/UserPreference";
import News from "../CreationMeeting/News";
import TableMeetingUser from "../User/TableMeetingUser";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Preference from "../../pages/Preference";

const User = ({ news, data }) => {
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(grey[600]),
    backgroundColor: grey[600],
    "&:hover": {
      backgroundColor: grey[700],
    },
  }));

  // const getToken = () => sessionStorage.getItem("token");
  const [submitsucess, setSubmitSucess] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState([]);

  useEffect(() => {
    if (data["final_date"] !== null && data["timeslots"]) {
      for (let i = 0; i < data["timeslots"].length; ++i) {
        if (data["final_date"] === data["timeslots"][i]["id"]) {
          setSelectedColumn(i + 1);
          return;
        }
      }
    }
  }, [data]);
  const [checkboxValues, setCheckboxValues] = useState([]);

  const columnSelection = (columnName) => {
    if (columnName !== 0) {
      if (selectedColumn === columnName) {
        setSelectedColumn("");
      } else {
        setSelectedColumn(columnName);
      }
    }
  };

  const handleSubmit = async (value) => {
    console.log("onSubmit value received:", value);
    setSubmitSucess(value);
  };
  const [viewList, setviewList]=useState(false);

  const viewLists = () => {
    // This function is called with the handleUpdateInternal function from TableMeetingUser
    // It can be stored and used later when the "Update Preferences" button is clicked
    setviewList(true);
  console.log("Update Value",viewLists)
  };
  const [updatepreferncetest,setUpdatedPreferenceTest]=useState(false);
  // const handleUpdate = () => {
  //   // Handle the update logic if needed
  //   console.log("Update Preferences button clicked!");
  // };

 
  const handleUpdate = () => {
    // This function is called with the handleUpdateInternal function from TableMeetingUser
    // It can be stored and used later when the "Update Preferences" button is clicked
    setUpdatedPreferenceTest(true);
    setSubmitSucess(false)
  console.log("Update Value",updatepreferncetest)
  };

  return (
    <div className="CreateGroup">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid className="sx_news" item xs={2}>
            <News news={news} start={0} numberOfDivsNews={3} />
          </Grid>
          <Grid style={{ marginTop: 32, paddingLeft: 0 }} item xs={8}>
            <div className="field">
              <Box sx={{ display: "flex" }}>
                {!submitsucess && <UserPreference data={data} />}
                <Divider
                  orientation="vertical"
                  flexItem
                  style={{ margin: "0 16px" }}
                />
                {/* Pass the callback function and states to TableMeetingUser */}
                {!submitsucess && (
                  <TableMeetingUser
                    onSubmit={handleSubmit}
                    data={data}
                    selectedColumn={selectedColumn}
                    columnSelection={columnSelection}
                    checkboxValues={checkboxValues}
                    setCheckboxValues={setCheckboxValues}
                  />
                )}
                {submitsucess && (
                   <div>
                   <h2>Your vote has been counted successfully!</h2>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ColorButton onClick={handleUpdate}>Change Your Response</ColorButton>
                    <ColorButton onClick={viewLists}>View Vote List</ColorButton>
                  </div>
                  {viewList && <UserPreference data={data} /> }
                  {viewList && <TableMeetingUser
                    // onSubmit={handleSubmit}
                    data={data}
                    selectedColumn={selectedColumn}
                    columnSelection={columnSelection}
                    checkboxValues={checkboxValues}
                    setCheckboxValues={setCheckboxValues}
                    viewList={viewList}
                  />}
                   {updatepreferncetest &&!submitsucess && <TableMeetingUser
                    onSubmit={handleSubmit}
                    data={data}
                    selectedColumn={selectedColumn}
                    columnSelection={columnSelection}
                    
                  />}
                 </div>
                )}
              </Box>
              <div style={{ textAlign: "end" }}>
                
              </div>
            </div>
            <div style={{ paddingTop: 30 }}>
              <Preference />
            </div>
          </Grid>
          <Grid className="dx_news" item xs={2}>
            <News news={news} start={3} numberOfDivsNews={6} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default User;
