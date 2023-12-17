import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./createGroup.css";
import SwitchSelect from "./SwitchSelect";

const CreateGroup = ({
  data,
  setData,
  onContraction,
  error,
  onExpand,
  video,
  setVideo,
  checked,
  setChecked,
}) => {
  return (
    <div className="CreateGroup">
      <p id="title_form" className="title">
        Create Group Poll
      </p>
      <Box
        className="fieldCreateGroup"
        component="form"
        sx={{
          "& .MuiTextField-root": {
            marginBottom: 4,
            marginRight: 2,
            width: "-webkit-fill-available",
          },
        }}
        noValidate
        autoComplete="off">
        <div className="form_creation">
          <TextField
            required
            helperText={error.title ? "Your invite needs a name" : ""}
            error={error.title}
            id="title-outlined-required"
            label="Title"
            value={data.title}
            name="title"
            style={{
              backgroundColor: "white",
            }}
            onChange={(e) => setData(e)}
            InputLabelProps={{
              style: {
                fontFamily: "Quicksand",
              },
            }}
          />
        </div>

        <div className="form_creation">
          <TextField
            id="outlined-multiline-flexible"
            label="Description"
            name="description"
            multiline
            maxRows={4}
            style={{
              backgroundColor: "white",
            }}
            value={data.description}
            onChange={(e) => setData(e)}
            InputLabelProps={{
              style: {
                fontFamily: "Quicksand",
              },
            }}
          />
        </div>

        <div className="form_creation">
          <TextField
            id="outlined"
            label="Location"
            name="location"
            value={data.location}
            style={{
              backgroundColor: "white",
            }}
            onChange={(e) => setData(e)}
            InputLabelProps={{
              style: {
                fontFamily: "Quicksand",
              },
            }}
          />
        </div>
        <SwitchSelect
          checked={checked}
          onContraction={onContraction}
          setChecked={setChecked}
          setVideo={setVideo}
          onExpand={onExpand}
        />
      </Box>
    </div>
  );
};

export default CreateGroup;
