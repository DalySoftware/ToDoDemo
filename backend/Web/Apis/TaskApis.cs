using Microsoft.AspNetCore.Http.HttpResults;
using ToDoDemoBackend.Web.Auth;
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

    private static async Task<GetTasksDto> GetTasks(TaskRepository repository, HttpContext context)
    {
        var userId = context.GetUserIdOrThrow();
        var tasks = await repository.GetAllTasks(userId);
        return tasks
            .GroupBy(task => task.Status)
            .ToDictionary(group => group.Key, group => group.ToList());
    }

    private static async Task PostTasks(
        ToDoTask task,
        TaskRepository repository,
        HttpContext context
    )
    {
        var userId = context.GetUserIdOrThrow();
        await repository.AddOrUpdate(userId, task);
    }

    private static async Task<Results<Ok, NotFound>> DeleteTaskId(
        string taskId,
        TaskRepository repository,
        HttpContext context
    )
    {
        var userId = context.GetUserIdOrThrow();
        if (await repository.Delete(userId, taskId) == 0)
        {
            return TypedResults.Ok();
        }

        return TypedResults.Ok();
    }
}
