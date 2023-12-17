import Grid from "@mui/material/Grid";
import "./welcome.css";
import Team from "../components/Welcome/Team";
import Faq from "../components/Welcome/Faq";
import Features from "../components/Welcome/Features";
import FeedbackImage from "../components/Feedback/FeedbackImage";
import FeedbackFormPage from "../components/Feedback/FeedbackFormPage";
import FeedbackComponent from "../components/Feedback/FeedbackComponent";

function Welcome() {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
          <h3>Find the Perfect Day for Your Meeting!</h3>
          <p>
            Are you tired of endless emails to arrange a date? We are here to
            make the process easier! With Doodle Unical, planning a meeting
            becomes a stress-free experience.
          </p>
          <p>
            Forget the difficulties of trying to coordinate everyone's
            availability. Our intuitive platform will guide you step by step to
            find the ideal day that works for all participants. Save precious
            time and focus your energy on the content of your meeting.
          </p>
          <p>
            With Doodle Unical, we make meeting planning a seamless,
            collaborative experience. Choose the perfect day in just a few
            clicks and enjoy more productive meetings!
          </p>
          <p>
            With Doodle Unical, we make meeting planning a seamless,
            collaborative experience. Choose the perfect day in just a few
            clicks and enjoy more productive meetings!
          </p>
          <p>
            Join us in the mission to simplify your schedule. Start planning a
            stress-free meeting today and focus on what matters most to you and
            your team!
          </p>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={4} style={{ marginTop: "auto", marginBottom: "auto" }}>
          <div>
            <a href={"/create"} className="no_style_a">
              <div className="field" id="field_hover">
                <h2>Create pool</h2>
                <p>to chose the perfect meeting day</p>
              </div>
            </a>
            <br />
            <br />
            <br />
            <br />
            <a href={"/dashboard"} className="no_style_a">
              <div className="field" id="field_hover">
                <h2>Manage pool</h2>
                <p>to edit and book the perfect day</p>
              </div>
            </a>
          </div>
        </Grid>
      </Grid>
      <Features />
      <br />
      <Team />
      <br />
      <Faq />
      <br />
    </div>
  );
}

export default Welcome;
