import PrimaryButton from "../Utils/PrimaryButton";
import TextField from "@mui/material/TextField";
import "./feedback_form_page.css";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const FeedbackFormPage = ({ setFormVisibility }) => {
  const [errorName, setErrorName] = useState(false);
  const [name, setName] = useState("");

  const updateName = (newName) => {
    setName(newName);
    if (newName !== "") setErrorName(false);
  };

  const [errorEmail, setErrorEmail] = useState(false);
  const [email, setEmail] = useState("");

  const updateEmail = (newEmail) => {
    setEmail(newEmail);
    if (newEmail !== "") setErrorEmail(false);
  };

  const [errorDescription, setErrorDescription] = useState(false);
  const [description, setDescription] = useState("");

  const updateDescription = (newDescription) => {
    setDescription(newDescription);
    if (newDescription !== "") setErrorDescription(false);
  };

  const [file, setFile] = useState(null);

  const loadFile = (event) => {
    const selectedFile = event.target.files[0];

    console.log("File selezionato:", selectedFile);
    setFile(selectedFile);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const sendFeedback = (event) => {
    event.preventDefault();

    if (checkRequirements()) {
      handleFormSubmit(event);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("message", description);
    if (file !== null) data.append(`file`, file, file.name);

    axios
      .post("http://127.0.0.1:8000/api/feedbacks/new/", data, {
        headers: {
          "Content-type": "multipart/form-data",
          withCredentials: true,
        },
      })
      .then((response) => {
        // alert("SUCCESS");
        setDescription("");
        setEmail("");
        setName("");
        setFile(null);
        setFormVisibility(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.name);
      });
  };

  const checkRequirements = () => {
    let bool = true;
    if (name === "") {
      setErrorName(true);
      bool = false;
    }
    if (description === "") {
      setErrorDescription(true);
      bool = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorEmail(true);
      bool = false;
    }
    return bool;
  };

  return (
    <div id="feedback_form_page" className="field">
      <div>
        <h3>Send us a feedback</h3>
        <div className="-">
          <TextField
            required
            helperText={errorName ? "You have to specify your name" : ""}
            error={errorName}
            id="title-outlined-required"
            label="Name"
            value={name}
            style={{
              backgroundColor: "white",
              width: "-webkit-fill-available",
              marginBottom: "15px",
            }}
            onChange={(e) => updateName(e.target.value)}
            InputLabelProps={{
              style: {
                fontFamily: "Quicksand",
              },
            }}
          />
        </div>
        <div style={{ marginBottom: 20 }}>
          <TextField
            required
            helperText={errorEmail ? "You have to specify your email" : ""}
            error={errorEmail}
            id="title-outlined-required"
            label="Email"
            type="email"
            value={email}
            style={{
              backgroundColor: "white",
              width: "-webkit-fill-available",
              marginBottom: "15px",
            }}
            onChange={(e) => updateEmail(e.target.value)}
            InputLabelProps={{
              style: {
                fontFamily: "Quicksand",
              },
            }}
          />
          <TextField
            required
            helperText={
              errorDescription ? "You have to specify a description" : ""
            }
            error={errorDescription}
            id="title-outlined-required"
            label="Description"
            multiline
            maxRows={1}
            value={description}
            style={{
              backgroundColor: "white",
              width: "-webkit-fill-available",
              marginBottom: "15px",
            }}
            onChange={(e) => updateDescription(e.target.value)}
            InputLabelProps={{
              style: {
                fontFamily: "Quicksand",
              },
            }}
          />
          <Button
            component="label"
            variant="contained"
            style={{ backgroundColor: "white", color: "#59483e" }}
            startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" onChange={loadFile} />
          </Button>
          {file !== null ? <p>{file.name}</p> : <div></div>}
        </div>
        <div style={{ textAlign: "end" }}>
          <PrimaryButton text="Send Feedback" functionOnClick={sendFeedback} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormPage;
