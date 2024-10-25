import Stack from "@mui/material/Stack/Stack";
import { Task, useDeleteTask, useUpsertTask } from "../api/tasks";
import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import IconButton from "@mui/material/IconButton/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskCard = ({
  task,
  isNew,
  onCancel,
  onDelete,
  onUpsert,
}: {
  task: Task;
  isNew?: boolean;
  onCancel: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpsert: (newTask: Task) => void;
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [localTaskState, setLocalTaskState] = useState(task);
  const { mutate: upsert } = useUpsertTask();
  const { mutate: deleteTask } = useDeleteTask();

  const onSave = () => {
    upsert(localTaskState);
    onUpsert(localTaskState);
    return setIsEditing(false);
  };
  const onCancelEdit = () => {
    onCancel(localTaskState.id);
    setLocalTaskState(task);
    return setIsEditing(false);
  };
  const onDeleteTask = () => {
    deleteTask(localTaskState);
    onDelete(localTaskState.id);
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
              <IconButton onClick={onSave}>
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
        {isEditing && !isNew && (
          <IconButton sx={{ alignSelf: "end" }} onClick={onDeleteTask}>
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Stack>
    </Card>
  );
};

export { TaskCard };
