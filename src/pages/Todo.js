import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ExercisesModal from "../components/ExercisesModal";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../utils/config";
import ModalBox from "../components/ModalBox";
import { registerPushNotification } from "../utils/registerPushNotification";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const Todo = () => {
  const [open, setOpen] = React.useState(false);
  const [day, setDay] = React.useState("");
  const [rows, setRows] = React.useState([]);

  const [openTimeModel, setOpenTimeModel] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");
  const [timeLocal, setTimeLocal] = useState("");
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const userId = localStorage.getItem("email");
        const tasksRef = collection(db, `users/${userId}/tasks`);

        // Query all documents within the tasks collection
        const querySnapshot = await getDocs(tasksRef);

        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        // console.log(tasks);
        let store = [];
        for (let day of daysOfWeek) {
          const tasks_ref = tasks.filter((task) => task.id === day);
          store.push({
            id: day,
            selectedExercisesName: tasks_ref[0]?.selectedExercisesName || [],
            selectedExercisesId: tasks_ref[0]?.selectedExercisesId || [],
            time: tasks_ref[0]?.time || "",
          });
        }
        console.log("done-store", store);
        setRows(store);
        // eslint-disable-next-line no-undef
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchAllTasks();
  }, [day]);

  const handleOpen = (day) => {
    setOpen(true);
    setDay(day);
  };
  const handleClose = () => {
    setOpen(false);
    setDay("");
  };

  const handleSubmit = async () => {
    try {
      const pushSubscription = await registerPushNotification();
      const userId = localStorage.getItem("email");

      await axios.post("http://localhost:3001/subscribe", {
        subscription: pushSubscription,
        time: notificationTime,
        day,
        userId,
      });
    } catch (err) {
      console.log(err);
    } finally {
      handleCloseTimeModel();
    }
  };
  console.log("render");
  const handleOpenTimeModel = (day) => {
    setOpenTimeModel(true);
    setDay(day);
  };
  const handleCloseTimeModel = () => {
    setOpenTimeModel(false);
    setDay("");
    setTimeLocal("");
    setNotificationTime("");
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
  };
  return (
    <div>
      Todo
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Days</TableCell>
              <TableCell align="right">Exercise</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow
                key={idx}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">
                  <div>
                    {row?.selectedExercisesName?.map((exercise, id) => (
                      <Chip key={id} label={exercise} />
                    ))}
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpen(row.id)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <span>{row.time}</span>
                  <br />
                  <Button
                    variant="contained"
                    onClick={() => handleOpenTimeModel(row.id)}
                  >
                    Reminders
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExercisesModal {...{ day, open, handleClose }} />
      <ModalBox open={openTimeModel} handleClose={handleCloseTimeModel}>
        Time: {notificationTime} <br />
        <input
          type="time"
          value={timeLocal}
          onChange={(e) => {
            setTimeLocal(e.target.value);
            setNotificationTime(formatTime(e.target.value));
          }}
        />
        <br />
        <Button variant="outlined" onClick={handleCloseTimeModel}>
          close
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add Reminder
        </Button>
      </ModalBox>
    </div>
  );
};

export default Todo;
