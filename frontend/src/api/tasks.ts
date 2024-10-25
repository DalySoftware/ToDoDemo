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
  const response = await fetch(baseUrl + "/tasks", {
    credentials: "include",
  });
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
const updateDependentQueries = (client: QueryClient) => {
  const baseData = client.getQueryData(["tasks"]) as TaskResponse;
  taskStatuses.forEach((status) => {
    client.setQueryData(
      ["tasks", status],
      baseData[status].map((t) => ({ ...t, status: status })),
    );
  });
};

const useUpsertTask = (initialStatus: TaskStatus) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      await fetch(baseUrl + "/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(task),
        credentials: "include",
      });
    },
    onSuccess: (_, task) => {
      client.setQueryData(["tasks"], (old: Record<TaskStatus, Task[]>) => {
        if (
          task.status == initialStatus &&
          old[task.status].some((t) => t.id === task.id)
        ) {
          return {
            ...old,
            [task.status]: old[task.status].map((existing) =>
              existing.id === task.id ? task : existing,
            ),
          };
        }

        if (task.status == initialStatus) {
          return {
            ...old,
            [task.status]: [...old[task.status], task],
          };
        }

        return {
          ...old,
          [initialStatus]: excludeTask(old[initialStatus], task.id),
          [task.status]: [...old[task.status], task],
        };
      });
      updateDependentQueries(client);
    },
  });
};

const useDeleteTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      await fetch(baseUrl + "/tasks/" + task.id, {
        method: "DELETE",
        credentials: "include",
      });
    },
    onSuccess: (_, task) => {
      client.setQueryData(["tasks"], (old: Record<TaskStatus, Task[]>) => ({
        ...old,
        [task.status]: excludeTask(old[task.status], task.id),
      }));
      updateDependentQueries(client);
    },
  });
};

export { taskStatuses, useGetTasksByStatus, useUpsertTask, useDeleteTask };
export type { Task, TaskStatus };
