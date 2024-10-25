using Google.Apis.Auth.AspNetCore3;
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
        var group = app.MapGroup("/tasks").RequireAuthorization();
        group.MapGet("/", GetTasks);
        group.MapPost("/", PostTasks);
        group.MapDelete("/{taskId}", DeleteTaskId);
    }

    private static async Task<GetTasksDto> GetTasks(
        TaskRepository repository,
        IGoogleAuthProvider auth
    )
    {
        Console.WriteLine((await auth.GetCredentialAsync()).UnderlyingCredential.ToString());
        // Console.WriteLine(userCredential.UserId);
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
