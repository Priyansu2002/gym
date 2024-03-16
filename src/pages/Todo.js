import React, { useEffect } from "react";

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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/config";

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

  useEffect(() => {
    const fetchAllTasks = async () => {
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
        if (tasks_ref.length > 0) {
          store.push(tasks_ref[0]);
        } else {
          store.push({
            id: day,
            selectedExercisesName: [],
            selectedExercisesId: [],
          });
        }
      }

      setRows(store);
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

  // const handleDelete = (id) => {
  //   console.info("You clicked the delete icon.", id);
  // };
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
                    {row?.selectedExercisesName.map((exercise, id) => (
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
                  <span>{row.time}</span> <input type="time" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ExercisesModal {...{ day, open, handleClose }} />
    </div>
  );
};

export default Todo;
