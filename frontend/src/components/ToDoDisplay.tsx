import Stack from "@mui/material/Stack/Stack";
import { StatusColumn } from "./StatusColumn.tsx";
import { taskStatuses } from "../api/tasks.ts";

const ToDoDisplay = () => (
  <Stack direction="row" spacing={5} paddingInline={5}>
    {taskStatuses.map((s) => (
      <StatusColumn status={s} key={s} />
    ))}
  </Stack>
);

export { ToDoDisplay };
