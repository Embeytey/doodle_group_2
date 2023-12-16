import Grid from "@mui/material/Grid";
import "./features.css";
import system from "../images/system.png";
import clock from "../images/clock.png";
import easy from "../images/easy.png";
import group from "../images/group.png";
import scrum from "../images/scrum.png";

const Features = () => {
  return (
    <div
      style={{
        marginRight: 20,
        marginLeft: 20,
        textAlign: "center",
        backgroundColor: "#d1c3bb",
        borderRadius: "10px",
      }}>
      <div class="features">
        <h3 style={{ paddingTop: 20 }}>Features</h3>
        <hr />
        <p
          style={{
            fontStyle: "italic",
            paddingBottom: 10,
            marginLeft: 80,
            marginRight: 80,
          }}>
          The main features that characterize our system
        </p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <Grid container spacing={2} style={{ marginTop: 55 }}>
            <Grid item xs={8}>
              <p>Flexible time slots</p>
            </Grid>
            <Grid
              item
              xs={4}
              style={{ marginTop: "auto", marginBottom: "auto" }}>
              <div class="feature_image_div">
                <img
                  id="feature"
                  class="feature_image_details"
                  src={clock}
                  alt="feature"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: 15 }}>
            <Grid item xs={8}>
              <p>Easy to use</p>
            </Grid>
            <Grid
              item
              xs={4}
              style={{ marginTop: "auto", marginBottom: "auto" }}>
              <div class="feature_image_div">
                <img
                  id="feature"
                  class="feature_image_details"
                  src={easy}
                  alt="feature"
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <img id="system" class="feature_image" src={system} alt="system" />
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={2} style={{ marginTop: 55 }}>
            <Grid
              item
              xs={4}
              style={{ marginTop: "auto", marginBottom: "auto" }}>
              <div class="feature_image_div">
                <img
                  id="feature"
                  class="feature_image_details"
                  src={group}
                  alt="feature"
                />
              </div>
            </Grid>
            <Grid item xs={8}>
              <p>Young and enterprising team</p>
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: 15 }}>
            <Grid
              item
              xs={4}
              style={{ marginTop: "auto", marginBottom: "auto" }}>
              <div class="feature_image_div">
                <img
                  id="feature"
                  class="feature_image_details"
                  src={scrum}
                  alt="feature"
                />
              </div>
            </Grid>
            <Grid item xs={8}>
              <p>Agile approach with Scrum</p>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </div>
  );
};

export default Features;
