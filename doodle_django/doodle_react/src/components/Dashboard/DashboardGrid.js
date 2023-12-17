import Grid from "@mui/material/Grid";
import MeetingsCreation from "./MeetingsCreation";
import Sidebar from "../Sidebar/Sidebar";

const DashboardGrid = ({ data }) => {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={8} style={{ paddingTop: 0 }}>
          <MeetingsCreation data={data} />
        </Grid>
        <Grid className="dx_news" item xs={2}></Grid>
      </Grid>
    </div>
  );
};

export default DashboardGrid;
