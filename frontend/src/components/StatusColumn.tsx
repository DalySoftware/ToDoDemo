import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import { Task, TaskStatus, useGetTasksByStatus } from "../api/tasks";
import Stack from "@mui/material/Stack/Stack";
import { StatusIcon } from "./StatusChip";
import { Suspense, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { TaskCard } from "./TaskCard";
import Button from "@mui/material/Button/Button";
import AddIcon from "@mui/icons-material/Add";

type ExistingTask = Task & { isNew?: false };
type DraftTask = Task & { isNew: true };
type MaybeTask = ExistingTask | DraftTask;

const noOp = () => {};

const defaultTask = (status: TaskStatus): DraftTask => ({
  id: crypto.randomUUID(),
  title: "Enter title",
  status: status,
  isNew: true,
});

const StatusColumn = ({ status }: { status: TaskStatus }) => {
  const { data: tasks } = useGetTasksByStatus(status);
  const [localTasks, setLocalTasks] = useState<ExistingTask[]>([]);
  const [drafts, setDrafts] = useState<DraftTask[]>([]);

  useEffect(() => setLocalTasks(tasks), [tasks]);

  const removeTask = (taskId: string) =>
    setLocalTasks((old) => old.filter((t) => t.id !== taskId));

  const removeDraft = (taskId: string) =>
    setDrafts((old) => old.filter((t) => t.id !== taskId));

  const onUpsert = (newTask: Task) => {
    if (newTask.status !== status) {
      removeTask(newTask.id);
      return;
    }
    setLocalTasks((old) =>
      old.map((existing) =>
        existing.id === newTask.id ? { ...newTask, isNew: false } : existing,
      ),
    );
    removeDraft(newTask.id);
  };

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
        {[...localTasks, ...drafts].map((t) => (
          <TaskCard
            task={t}
            key={t.id}
            onCancel={t.isNew ? removeDraft : noOp}
            onDelete={removeTask}
            onUpsert={onUpsert}
          />
        ))}
      </Suspense>
      <Button
        startIcon={<AddIcon fontSize="large" color="success" />}
        sx={{ marginTop: "auto" }}
        onClick={() => setDrafts((old) => [...old, defaultTask(status)])}
      >
        New Task
      </Button>
    </Card>
  );
};

export { StatusColumn };
export type { MaybeTask };
