import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { TaskStatus, useGetTasksByStatus } from "../api/tasks";
import Stack from "@mui/material/Stack/Stack";
import { StatusIcon } from "./StatusChip";
import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { TaskCard } from "./TaskCard";

const Tasks = ({ status }: { status: TaskStatus }) => {
  const { data: tasks } = useGetTasksByStatus(status);
  return tasks.map((t) => <TaskCard task={t} key={t.id} />);
};

const StatusColumn = ({ status }: { status: TaskStatus }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
        padding: 2,
        gap: 3,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography component="h2" variant="h4" align="center">
          {status}
        </Typography>
        <StatusIcon status={status} />
      </Stack>
      <Suspense fallback={<CircularProgress sx={{ alignSelf: "center" }} />}>
        <Tasks status={status} />
      </Suspense>
    </Card>
  );
};

export { StatusColumn };
