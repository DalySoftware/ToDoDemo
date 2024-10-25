import { StatusColumn } from "./StatusColumn.tsx";
import { taskStatuses } from "../api/tasks.ts";
import Box from "@mui/material/Box/Box";

const ToDoDisplay = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fit, minmax(30ch, 400px))"
      gap={5}
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
