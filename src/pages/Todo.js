import React from "react";

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

const Todo = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function createData(name, exercise, time) {
    return { name, exercise, time };
  }
  const rows = [
    createData("Monday", ["exercise", "part"], "08:00:00"),
    createData("Tuesday", ["exercise", "part"], "08:00:00"),
  ];

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
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <div>
                    {row.exercise.map((exercise, id) => (
                      <Chip key={id} label={exercise} />
                    ))}
                    <Button variant="outlined" onClick={handleOpen}>
                      Add
                    </Button>
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
      <ExercisesModal {...{ open, handleClose }} />
    </div>
  );
};

export default Todo;
