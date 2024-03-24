import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Box from "@mui/material/Box";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import exercisesDataByParts from "../utils/data";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   //   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PreviewIcon from "@mui/icons-material/Preview";
import ModalBox from "./ModalBox";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/config";

const parts = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];

function ExercisesModal({ day, open, handleClose }) {
  const [partsName, setPartsName] = React.useState([]);
  //
  const [selectedExercises, setSelectedExercises] = React.useState([]);
  const [selectedExercisesName, setSelectedExercisesName] = React.useState([]);
  //
  const [value, setValue] = React.useState(0);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [exerciseDetails, setExerciseDetails] = React.useState({});

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    async function fetch() {
      if (day === "") return;
      const userId = localStorage.getItem("email");
      const taskRef = doc(db, `users/${userId}/tasks`, day);
      const taskSnapshot = await getDoc(taskRef);
      if (taskSnapshot.exists()) {
        const taskData = taskSnapshot.data();
        setSelectedExercisesName(taskData?.selectedExercisesName || []);
        setSelectedExercises(taskData?.selectedExercisesId || []);
      }
    }
    fetch();
  }, [day]);

  const handleSubmit = async (event) => {
    const userId = localStorage.getItem("email");
    const taskRef = doc(db, `users/${userId}/tasks`, day);
    await setDoc(
      taskRef,
      {
        selectedExercisesId: selectedExercises,
        selectedExercisesName,
      },
      { merge: true }
    );
    handleClose();
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPartsName(typeof value === "string" ? value.split(",") : value);
  };

  const handleTabsChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleClick = (exerciseName, id) => {
    //     console.log(exerciseName, id);
    setSelectedExercises((prev) => [...prev, id]);
    setSelectedExercisesName((prev) => [...prev, exerciseName]);
  };

  const handleRemove = (exerciseName, id) => {
    const update = selectedExercises.filter((selected) => selected !== id);
    setSelectedExercises(update);
    const updateName = selectedExercisesName.filter(
      (selected) => selected !== exerciseName
    );
    setSelectedExercisesName(updateName);
  };

  const handlePreviewOpen = (exercise) => {
    setExerciseDetails(exercise);
    setPreviewOpen(true);
  };
  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setExerciseDetails({});
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          Let Google help apps determine location. This means sending anonymous
          location data to Google, even when no apps are running.
        </DialogContentText>
        <Box>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              Select Parts
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={partsName}
              onChange={handleChange}
              input={<OutlinedInput label="Select Parts" />}
              renderValue={(selected) =>
                selected.map((select, i) => <Chip key={i} label={select} />)
              }
              // MenuProps={MenuProps}
            >
              {parts.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={partsName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            {selectedExercisesName.map((name, id) => (
              <Chip label={name} key={id} />
            ))}
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleTabsChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {partsName.map((part, idx) => (
                <Tab key={idx} label={part} {...a11yProps(idx)} />
              ))}
            </Tabs>
          </Box>
          {partsName.map((part, idx) => (
            <CustomTabPanel key={idx} value={value} index={idx}>
              {exercisesDataByParts[part].map((exercise, idx) => (
                <div key={idx} className="exercise-table-row">
                  <div>{exercise.name}</div>
                  <div className="space-2">
                    <IconButton
                      aria-label="preview"
                      onClick={() => handlePreviewOpen(exercise)}
                    >
                      <PreviewIcon />
                    </IconButton>

                    {!selectedExercises.includes(exercise.id) ? (
                      <IconButton
                        aria-label="add"
                        onClick={() => handleClick(exercise.name, exercise.id)}
                      >
                        <AddIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleRemove(exercise.name, exercise.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              ))}
            </CustomTabPanel>
          ))}
        </Box>
        <ModalBox open={previewOpen} handleClose={handlePreviewClose}>
          <img src={exerciseDetails.gifUrl} alt="gif" width={200} />
          <p>{exerciseDetails.name}</p>
          <div align="right">
            <Button onClick={handlePreviewClose}>close</Button>
          </div>
        </ModalBox>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Disagree
        </Button>
        <Button onClick={handleSubmit} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default ExercisesModal;
