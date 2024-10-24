import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { Task, TaskStatus } from "../api/tasks";
import Stack from "@mui/material/Stack/Stack";
import { StatusIcon } from "./StatusChip";

const TaskCard = ({ task }: { task: Task }) => (
  <Card>
    <Stack spacing={1} alignItems="stretch">

      <Typography variant="h5" component="h3">
        {task.title}
      </Typography>
      <Typography variant="body1" sx={{textWrap: "pretty"}}>{task.description}</Typography>
    </Stack>
  </Card>
);

const StatusColumn = ({ status, tasks }: { status: TaskStatus; tasks: Task[] }) => (
    <Card
        sx={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            padding: 2,
        }}
    >
        <Stack  spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography component="h2" variant="h4" align="center">
                  {status}
              </Typography>
              <StatusIcon status={status}/>
            </Stack>
            {tasks.map((t) => (
                <TaskCard task={t} key={t.title} />
            ))}
        </Stack>
    </Card>
);

export { StatusColumn };
