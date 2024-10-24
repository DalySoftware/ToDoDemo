import { StatusColumn } from "./StatusColumn.tsx";
import { taskStatuses } from "../api/tasks.ts";
import Box from "@mui/material/Box/Box";
import { Suspense } from "react";

const ToDoDisplay = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(30ch, 400px))"
      columnGap={5}
      width="100%"
      justifyContent="center"
    >
      {taskStatuses.map((s) => (
        <StatusColumn status={s} key={s} />
      ))}
    </Box>
  );
};

export { ToDoDisplay };
