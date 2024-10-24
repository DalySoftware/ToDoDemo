import Stack from "@mui/material/Stack/Stack";
import {StatusColumn} from "./StatusColumn.tsx";

const ToDoDisplay = () => (
    <Stack direction="row" spacing={5} paddingInline={5}>
        <StatusColumn status="To Do"/>
        <StatusColumn status="In Progress"/>
        <StatusColumn status="Done"/>
    </Stack>
)

export {ToDoDisplay}