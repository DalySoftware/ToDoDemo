import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { Task, TaskStatus, useGetTasksByStatus } from "../api/tasks";
import Stack from "@mui/material/Stack/Stack";
import { StatusIcon } from "./StatusChip";
import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

const TaskCard = ({ task }: { task: Task }) => (
  <Card>
    <Stack spacing={1} alignItems="stretch">
      <Typography variant="h5" component="h3">
        {task.title}
      </Typography>
      <Typography variant="body1" sx={{ textWrap: "pretty" }}>
        {task.description}
      </Typography>
    </Stack>
  </Card>
);

const Tasks = ({ status }: { status: TaskStatus }) => {
  const { data: tasks } = useGetTasksByStatus(status);
  return tasks.map((t) => <TaskCard task={t} key={t.title} />);
};

const StatusColumn = ({ status }: { status: TaskStatus }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        padding: 2,
      }}
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography component="h2" variant="h4" align="center">
            {status}
          </Typography>
          <StatusIcon status={status} />
        </Stack>
        <Suspense fallback={<CircularProgress sx={{ alignSelf: "center" }} />}>
          <Tasks status={status} />
        </Suspense>
      </Stack>
    </Card>
  );
};

export { StatusColumn };
