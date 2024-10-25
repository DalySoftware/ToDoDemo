import {
  QueryClient,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { z } from "zod";
import config from "../config";

const taskStatuses = ["To Do", "In Progress", "Done"] as const;
const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
});
type TaskStatus = (typeof taskStatuses)[number];
type Task = z.infer<typeof taskSchema> & { status: TaskStatus };

const taskResponseSchema = z.object({
  "To Do": z.array(taskSchema).default([]),
  "In Progress": z.array(taskSchema).default([]),
  Done: z.array(taskSchema).default([]),
});

type TaskResponse = z.infer<typeof taskResponseSchema>;

const baseUrl = config.BACKEND_BASE_URL;

const getTasks = async (): Promise<TaskResponse> => {
  const response = await fetch(baseUrl + "/tasks");
  const json = await response.json();
  const result = await taskResponseSchema.safeParseAsync(json);
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
};

const useGetTasksWithCache = async () => {
  const client = useQueryClient();
  const data = await client.fetchQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  return data;
};

const useGetTasksByStatus = (status: TaskStatus) => {
  return useSuspenseQuery({
    queryKey: ["tasks", status],
    queryFn: async () => {
      const response = await useGetTasksWithCache();
      return response[status].map((t) => ({ ...t, status: status }));
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
    mutationFn: async (task: Task) => {
      await fetch(baseUrl + "/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(task),
      });
    },
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
    mutationFn: async (task: Task) => {
      await fetch(baseUrl + "/tasks/" + task.id, {
        method: "DELETE",
      });
    },
    onSuccess: (_, task) =>
      client.setQueryData(["tasks", task.status], (old: Task[]) =>
        excludeTask(old, task.id),
      ),
  });
};

export { taskStatuses, useGetTasksByStatus, useUpsertTask, useDeleteTask };
export type { Task, TaskStatus };
