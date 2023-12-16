import timeImage from "../images/time.png";
import locationImage from "../images/location.png";
import videoImage from "../images/video.png";
import descriptionImage from "../images/description.png";
import correctImage from "../images/correct.png";
import noImage from "../images/no.png";
import maybeImage from "../images/maybe.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import "../ManageMeeting/manage.css";

const UserPreference = ({ data }) => {
  // const ColorButton = styled(Button)(({ theme }) => ({
  //   color: theme.palette.getContrastText(grey[600]),
  //   backgroundColor: grey[600],
  //   "&:hover": {
  //     backgroundColor: grey[700],
  //   },
  // }));

  // const ColorButton2 = styled(Button)(({ theme }) => ({
  //   color: theme.palette.getContrastText(grey[50]),
  //   backgroundColor: grey[50],
  //   "&:hover": {
  //     backgroundColor: grey[50],
  //   },
  // }));
  // const organizerData = {
  //   partecipants: "DK Diago Kass",
  //   month: "organizer",
  //   month2: "organizer",
  // };
  return (
    <div className="CreateGroup">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {/* Left side */}
          <Grid item xs={6}>
            <>
            
      {/* <div className="organizer-info" style={{  alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
    <Avatar sx={{ bgcolor: 'grey' }}>D</Avatar>
    <div style={{ marginLeft: '8px' }}>
      <h2 style={{ margin: 0 }}>Degefom</h2>
    </div>
  </div>
  
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <p style={{ margin: 0 }}>is organizing</p>
  </div>
  </div>   */}

              <h2>{data["title"]}</h2>
              <div className="manage_div_info">
                <img src={timeImage} alt="time.png" />
                <nobr>{data["duration"]}</nobr>
              </div>
              {data["location"] !== "" && (
                <div className="manage_div_info">
                  <img src={locationImage} alt="location.png" />
                  <nobr>{data["location"]}</nobr>
                </div>
              )}
              {data["video_conferencing"] === true && (
                <div className="manage_div_info">
                  <img src={videoImage} alt="video.png" />
                  <nobr>{data["video_type_id"]}</nobr>
                </div>
              )}
              {data["description"] !== "" && (
                <div className="manage_div_info">
                  <img src={descriptionImage} alt="description.png" />
                  <nobr>{data["description"]}</nobr>
                </div>
              )}
            </>
          </Grid>
          {/* Right side */}
          <Grid item xs={6}>
            <div style={{ textAlign: "end" }}>
              {/* Add any content for the right side */}
            </div>
          </Grid>
          {/* Bottom left */}
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft:'30px'}}>
                  <nobr className="manage_nobr_info">
                    <img src={correctImage} alt="correct.png" />
                    <nobr>Yes</nobr>
                  </nobr>
                  <nobr className="manage_nobr_info">
                    <img src={maybeImage} alt="maybe.png" />
                    <nobr>Maybe</nobr>
                  </nobr>
                  <nobr className="manage_nobr_info">
                    <img src={noImage} alt="no.png" />
                    <nobr>No</nobr>
                  </nobr>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </div>
  );
   
};  
export default UserPreference;
