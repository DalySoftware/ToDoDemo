import {
  QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { z } from "zod";

const taskStatuses = ["To Do", "In Progress", "Done"] as const;
const taskSchema = z.object({
  id: z.string(),
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
      id: crypto.randomUUID(),
      title: "Deploy the code",
    },
  ],
  "In Progress": [
    {
      id: crypto.randomUUID(),
      title: "Test the code",
      description:
        "This is a very long description of testing. I need to make this long so I can see what long descriptions look like.",
    },
  ],
  Done: [
    {
      id: crypto.randomUUID(),
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

const excludeTask = (tasks: Task[], taskIdToExclude: string) =>
  tasks.filter((t) => t.id != taskIdToExclude);

// It's a cheap operation to invalidate the client filtered queries
// Eg this invalidates ["tasks", "To Do"] but not ["tasks"]
const invalidateFilteredQueries = (client: QueryClient) => {
  client.invalidateQueries({
    predicate: (query) =>
      query.queryKey[0] == "tasks" &&
      taskStatuses.includes(query.queryKey[1] as TaskStatus),
  });
};

const useUpsertTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (_: Task) => {},
    onSuccess: (_, task) => {
      client.setQueryData(["tasks"], (old: Task[]) => [
        ...excludeTask(old, task.id),
        task,
      ]);
      invalidateFilteredQueries(client);
    },
  });
};

const useDeleteTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (_: Task) => {},
    onSuccess: (_, task) =>
      client.setQueryData(["tasks", task.status], (old: Task[]) =>
        excludeTask(old, task.id),
      ),
  });
};

export { taskStatuses, useGetTasksByStatus, useUpsertTask, useDeleteTask };
export type { Task, TaskStatus };
