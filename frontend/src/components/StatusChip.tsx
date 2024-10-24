import { ReactNode } from "react";
import { TaskStatus } from "../api/tasks";
import ListIcon from '@mui/icons-material/List';
import CheckCircle from "@mui/icons-material/CheckCircle";
import PendingIcon from '@mui/icons-material/Pending';

const mapping: Record<TaskStatus, ReactNode> =  {
    "To Do": <ListIcon fontSize="large" color="primary"/>,
    "In Progress": <PendingIcon  fontSize="large" color="warning"/>,
    "Done": <CheckCircle  fontSize="large" color="success"/>,
}

const StatusIcon = ({status}: { status: TaskStatus}) => (
    mapping[status]
)

export { StatusIcon }