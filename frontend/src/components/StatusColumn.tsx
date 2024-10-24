import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { Task } from "../api/tasks";
import Stack from "@mui/material/Stack/Stack";

const TaskCard = ({ task }: { task: Task }) => (
  <Card>
    <Stack spacing={1} alignItems="stretch">

      <Typography variant="h5" component="h3">
        {task.title}
      </Typography>
      <Typography variant="body1">{task.description}</Typography>
    </Stack>
  </Card>
);

const StatusColumn = ({ status, tasks }: { status: string; tasks: Task[] }) => (
    <Card
        sx={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            padding: 2,
        }}
    >
        <Stack direction="column" spacing={3}>
            <Typography component="h2" variant="h4" align="center">
                {status}
            </Typography>
            {tasks.map((t) => (
                <TaskCard task={t} key={t.title} />
            ))}
        </Stack>
    </Card>
);

export { StatusColumn };
