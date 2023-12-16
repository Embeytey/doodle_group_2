import vincenzo from "../images/vincenzo.png";
import fabio from "../images/fabio.png";
import dege from "../images/dege.png";
import tsion from "../images/tsion.png";
import hila from "../images/hila.jpg";
import "./team.css";
import Grid from "@mui/material/Grid";

const Team = () => {
  return (
    <div style={{ marginRight: 20, marginLeft: 20, textAlign: "center" }}>
      <div class="team">
        <h3>Our Team</h3>
        <hr />
        <p
          style={{
            fontStyle: "italic",
            paddingBottom: 10,
            marginLeft: 80,
            marginRight: 80,
          }}>
          This project is created for the Agile Software Development course of
          the University of Calabria in the year 2023/2024 supported by Prof. F.
          Ricca
        </p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <div className="team-container">
            <a
              href="https://github.com/Degephomk"
              target="_blank"
              class="team-detail">
              <img src={dege} class="img-fluid" />
              <div class="overlay">
                <div class="team-name">
                  <h4>Degefom Kahsay Berhe</h4>
                  <p>Team Developer</p>
                </div>
              </div>
            </a>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <div className="team-container">
            <a
              href="https://github.com/Fappio97"
              target="_blank"
              class="team-detail">
              <img src={fabio} class="img-fluid" />
              <div class="overlay">
                <div class="team-name">
                  <h4>Fabio Cangeri</h4>
                  <p>Scrum Master</p>
                </div>
              </div>
            </a>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <div className="team-container">
            <a
              href="https://github.com/Embeytey"
              target="_blank"
              class="team-detail">
              <img src={hila} class="img-fluid" />
              <div class="overlay">
                <div class="team-name">
                  <h4>Hilary Tesfay Gebreslassie</h4>
                  <p>Team Developer</p>
                </div>
              </div>
            </a>
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={3.5}></Grid>
        <Grid item xs={2}>
          <div className="team-container">
            <a
              href="https://github.com/tsion-19"
              target="_blank"
              class="team-detail">
              <img src={tsion} class="img-fluid" />
              <div class="overlay">
                <div class="team-name">
                  <h4>Tsion Gebreegziabher Ebuy</h4>
                  <p style={{ marginBlockStart: "0.5em" }}>Team Developer</p>
                </div>
              </div>
            </a>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <div className="team-container">
            <a
              href="https://github.com/uhth"
              target="_blank"
              class="team-detail">
              <img src={vincenzo} class="img-fluid" />
              <div class="overlay">
                <div class="team-name">
                  <h4>Vincenzo Rizzo</h4>
                  <p>Product Owner</p>
                </div>
              </div>
            </a>
          </div>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </div>
  );
};

export default Team;
