import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { z } from "zod";

const taskStatuses = ["To Do", "In Progress", "Done"] as const;
const taskSchema = z.object({
  title: z.string(),
  description: z.optional(z.string()),
});
type TaskStatus = (typeof taskStatuses)[number];
type Task = z.infer<typeof taskSchema> & { status: TaskStatus };

const taskResponseSchema = z.object({
  "To Do": z.array(taskSchema),
  "In Progress": z.array(taskSchema),
  Done: z.array(taskSchema),
});

type TaskResponse = z.infer<typeof taskResponseSchema>;

const mockResponse: TaskResponse = {
  "To Do": [
    {
      title: "Deploy the code",
    },
  ],
  "In Progress": [
    {
      title: "Test the code",
      description:
        "This is a very long description of testing. I need to make this long so I can see what long descriptions look like.",
    },
  ],
  Done: [
    {
      title: "Write the code",
    },
  ],
};

const mockGetTasks = async () => {
  await new Promise((res) => setTimeout(res, 500));
  return mockResponse;
};

const getTasksWithCache = async () => {
  const client = useQueryClient();
  const data = await client.fetchQuery({
    queryKey: ["tasks"],
    queryFn: mockGetTasks,
  });

  return data;
};

const useGetTasksByStatus = (status: TaskStatus) => {
  return useSuspenseQuery({
    queryKey: ["tasks", status],
    queryFn: async () => {
      const response = await getTasksWithCache();
      return response![status].map((t) => ({ ...t, status: status }));
    },
  });
};

export { taskStatuses, useGetTasksByStatus };
export type { Task, TaskStatus };
