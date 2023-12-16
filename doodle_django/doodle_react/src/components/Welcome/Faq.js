import Grid from "@mui/material/Grid";
import "./faq.css";

const Faq = () => {
  return (
    <div
      style={{
        marginRight: 20,
        marginLeft: 20,
        textAlign: "center",
        backgroundColor: "#d1c3bb",
        borderRadius: "10px",
      }}>
      <div class="faq">
        <h3 style={{ paddingTop: 20 }}>Frequently Asked Questions</h3>
        <hr />
        <p
          style={{
            fontStyle: "italic",
            paddingBottom: 10,
            marginLeft: 80,
            marginRight: 80,
          }}>
          The main questions we are asked
        </p>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={1.5}></Grid>
        <Grid item xs={4}>
          <div class="question-answer">
            <h4>How can I use this service to schedule a meeting?</h4>
            <p>
              You can get started by going to the "Create Meeting" page. Then
              follow the instructions to enter your meeting details, including
              the title, description, location and timeslosts
            </p>
          </div>
          <div class="question-answer">
            <h4>What are timeslots?</h4>
            <p>
              Timeslots are a possible day and time for your meeting. Provide
              the ones that are most convenient for you.
            </p>
          </div>
          <div class="question-answer">
            <h4>Can I view participant availability before setting a date?</h4>
            <p>
              Yes, our service offers the functionality of viewing participant
              availability.
            </p>
          </div>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}>
          <div class="question-answer">
            <h4>
              What happens if a participant is not available on the proposed
              dates?
            </h4>
            <p>
              In this case participants will be able to provide their timeslots
              to search for a common day when you are all available.
            </p>
          </div>
          <div class="question-answer">
            <h4>Can I change a meeting once it's scheduled?</h4>
            <p>
              Yes, you can log in to your account and edit meeting details or
              cancel if necessary.
            </p>
          </div>
          <div class="question-answer">
            <h4>Is the service free?</h4>
            <p>
              Yes, our service is free. You will notice some advertising
              scattered here and there to encourage you to come and study at our
              university.
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Faq;
