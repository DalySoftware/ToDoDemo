import { StatusColumn } from "./StatusColumn.tsx";
import { Task, taskStatuses } from "../api/tasks.ts";
import Box from "@mui/material/Box/Box";

const sampleTasks: Task[] = [
  {
    title: "Write the code",
    status: "Done",
  },
  {
    title: "Test the code",
    status: "In Progress",
    description: "This is a very long description of testing. I need to make this long so I can see what long descriptions look like.",
  },
  {
    title: "Deploy the code",
    status: "To Do",
  },
];

const ToDoDisplay = () => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(auto-fit, minmax(30ch, 400px))"
    columnGap={5}
    width="100%"
    justifyContent="center"
  >
    {taskStatuses.map((s) => (
      <StatusColumn
        status={s}
        key={s}
        tasks={sampleTasks.filter((t) => t.status == s)}
      />
    ))}
  </Box>
);

export { ToDoDisplay };
