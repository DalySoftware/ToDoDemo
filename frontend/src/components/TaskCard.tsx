import Stack from "@mui/material/Stack/Stack";
import {
  Task,
  TaskStatus,
  taskStatuses,
  useDeleteTask,
  useUpsertTask,
} from "../api/tasks";
import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import IconButton from "@mui/material/IconButton/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button/Button";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";
import { MaybeTask } from "./StatusColumn";

const TaskCard = ({
  task,
  onCancel,
  onDelete,
  onUpsert,
}: {
  task: MaybeTask;
  onCancel: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpsert: (newTask: Task) => void;
}) => {
  const [isEditing, setIsEditing] = useState(task.isNew);
  const [localTaskState, setLocalTaskState] = useState(task);
  const { mutate: upsert } = useUpsertTask(task.status);
  const { mutate: deleteTask } = useDeleteTask();

  const onSubmitEdit = () => {
    setIsEditing(false);
    setLocalTaskState((old) => ({ ...old, isNew: false }));
    const { isNew, ...task } = localTaskState;
    upsert(task);
    onUpsert(task);
  };
  const onCancelEdit = () => {
    onCancel(localTaskState.id);
    setLocalTaskState(task);
    setIsEditing(false);
  };
  const onDeleteTask = () => {
    deleteTask(localTaskState);
    onDelete(localTaskState.id);
  };
  const onChangeStatus = (newStatus: TaskStatus) => () => {
    const updatedTask = { ...localTaskState, status: newStatus };
    upsert(updatedTask);
    onUpsert(updatedTask);
  };

  return (
    <Card>
      <Stack spacing={2} alignItems="stretch">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h5"
            component="h3"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) =>
              setLocalTaskState({
                ...localTaskState,
                title: e.currentTarget.innerText,
              })
            }
          >
            {localTaskState.title}
          </Typography>
          {isEditing ? (
            <Stack direction="row">
              <IconButton onClick={onSubmitEdit}>
                <DoneIcon color="success" />
              </IconButton>
              <IconButton onClick={onCancelEdit}>
                <ClearIcon color="warning" />
              </IconButton>
            </Stack>
          ) : (
            <IconButton
              onClick={() => setIsEditing(true)}
              aria-label="Edit Task"
            >
              <EditIcon />
            </IconButton>
          )}
        </Stack>
        {(localTaskState.description || isEditing) && (
          <Typography
            variant="body1"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) =>
              setLocalTaskState({
                ...localTaskState,
                description: e.currentTarget.innerText,
              })
            }
            border={isEditing && !localTaskState.description ? 1 : 0}
            borderRadius={1}
          >
            {localTaskState.description}
          </Typography>
        )}
        {!isEditing && (
          <ButtonGroup sx={{ alignSelf: "center" }}>
            {taskStatuses
              .filter((status) => status !== task.status)
              .map((status) => (
                <Button
                  onClick={onChangeStatus(status)}
                  key={"updateStatus" + status}
                >
                  {status}
                </Button>
              ))}
          </ButtonGroup>
        )}
        {isEditing && !task.isNew && (
          <IconButton sx={{ alignSelf: "end" }} onClick={onDeleteTask}>
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Stack>
    </Card>
  );
};

export { TaskCard };
