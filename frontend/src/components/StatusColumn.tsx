import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { Task, TaskStatus, useGetTasksByStatus } from "../api/tasks";
import Stack from "@mui/material/Stack/Stack";
import { StatusIcon } from "./StatusChip";
import { Suspense, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { TaskCard } from "./TaskCard";
import Button from "@mui/material/Button/Button";
import AddIcon from "@mui/icons-material/Add";

type MaybeNewTask = Task & { isNew?: boolean };

const noOp = () => {};

const Tasks = ({
  tasks,
  cancelNew,
  onDelete,
}: {
  tasks: MaybeNewTask[];
  cancelNew: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}) =>
  tasks.map((t) => (
    <TaskCard
      task={t}
      key={t.id}
      isNew={t.isNew}
      onCancel={t.isNew ? cancelNew : noOp}
      onDelete={onDelete}
    />
  ));

const defaultTask = (status: TaskStatus): MaybeNewTask => ({
  id: crypto.randomUUID(),
  title: "Enter title",
  status: status,
  isNew: true,
});

const StatusColumn = ({ status }: { status: TaskStatus }) => {
  const { data: tasks } = useGetTasksByStatus(status);
  const [localTasks, setLocalTasks] = useState<MaybeNewTask[]>(tasks);

  const excludeTask = (taskId: string) =>
    setLocalTasks((old) => old.filter((t) => t.id != taskId));

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
        <Tasks
          tasks={localTasks}
          cancelNew={excludeTask}
          onDelete={excludeTask}
        />
      </Suspense>
      <Button
        startIcon={<AddIcon fontSize="large" color="success" />}
        sx={{ marginTop: "auto" }}
        onClick={() => setLocalTasks((old) => [...old, defaultTask(status)])}
      >
        New Task
      </Button>
    </Card>
  );
};

export { StatusColumn };
