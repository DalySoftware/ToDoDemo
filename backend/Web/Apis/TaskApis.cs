using Microsoft.AspNetCore.Http.HttpResults;
using ToDoDemoBackend.Web.Models;
using ToDoDemoBackend.Web.Persistence;
using GetTasksDto = System.Collections.Generic.Dictionary<
    string,
    System.Collections.Generic.List<ToDoDemoBackend.Web.Models.ToDoTask>
>;

namespace ToDoDemoBackend.Web.Apis;

internal static class TaskApis
{
    internal static void MapTaskApis(this WebApplication app)
    {
        app.MapGet("/tasks", GetTasks);
        app.MapPost("/tasks", PostTasks);
        app.MapDelete("/tasks/{taskId}", DeleteTaskId);
    }

    private static async Task<GetTasksDto> GetTasks(TaskRepository repository)
    {
        var tasks = await repository.GetAllTasks();
        return tasks
            .GroupBy(task => task.Status)
            .ToDictionary(group => group.Key, group => group.ToList());
    }

    private static async Task PostTasks(ToDoTask task, TaskRepository repository) =>
        await repository.AddOrUpdate(task);

    private static async Task<Results<Ok, NotFound>> DeleteTaskId(
        string taskId,
        TaskRepository repository
    )
    {
        if (await repository.Delete(taskId) == 0)
        {
            return TypedResults.Ok();
        }

        return TypedResults.Ok();
    }
}
