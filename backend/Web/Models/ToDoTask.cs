namespace ToDoDemoBackend.Web.Models;

// Have to prefix to avoid clashing between System.Task and the domain model
public record ToDoTask(string Id, string Title, string? Description, string Status);
