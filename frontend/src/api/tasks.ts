import { z } from "zod";

const taskStatuses = ["To Do", "In Progress", "Done"] as const;
const taskSchema = z.object({
  title: z.string(),
  description: z.optional(z.string()),
  status: z.enum(taskStatuses),
});

type Task = z.infer<typeof taskSchema>;
type TaskStatus = Pick<Task, "status">;

export { taskStatuses };
export type { Task, TaskStatus };
