import Stack from "@mui/material/Stack/Stack";
import { Task, useUpsertTask } from "../api/tasks";
import Card from "@mui/material/Card/Card";
import Typography from "@mui/material/Typography/Typography";
import IconButton from "@mui/material/IconButton/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

const TaskCard = ({ task }: { task: Task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTaskState, setLocalTaskState] = useState(task);
  const { mutate } = useUpsertTask();

  const onSave = () => {
    mutate(localTaskState);
    return setIsEditing(false);
  };
  const onCancel = () => {
    setLocalTaskState(task);
    return setIsEditing(false);
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
              <IconButton onClick={onCancel}>
                <ClearIcon color="error" />
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
        {localTaskState.description && (
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
          >
            {localTaskState.description}
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

export { TaskCard };
