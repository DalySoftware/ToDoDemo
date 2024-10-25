using Microsoft.Data.Sqlite;
using ToDoDemoBackend.Web.Models;

namespace ToDoDemoBackend.Web.Persistence;

internal class TaskRepository : IDisposable
{
    private SqliteConnection _connection = SqliteUtilities.GetDbConnection();

    private static ToDoTask ReadAsTask(SqliteDataReader reader) =>
        new(
            reader.GetString(0),
            reader.GetString(1),
            reader.IsDBNull(2) ? null : reader.GetString(2),
            reader.GetString(3)
        );

    internal async Task<IReadOnlyCollection<ToDoTask>> GetAllTasks(string userId)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                SELECT Id, Title, Description, Status
                FROM Tasks
                WHERE UserId = $UserId
            """;

        command.Parameters.AddWithValue("$UserId", userId);

        using var reader = await command.ExecuteReaderAsync();
        var tasks = new List<ToDoTask>();

        while (await reader.ReadAsync())
        {
            var task = ReadAsTask(reader);
            tasks.Add(task);
        }

        return tasks;
    }

    internal async Task<ToDoTask?> GetTask(string userId, string id)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                SELECT Id, Title, Description, Status
                FROM Tasks
                WHERE UserId = $UserId AND Id = $Id
            """;
        command.Parameters.AddWithValue("$UserId", userId);
        command.Parameters.AddWithValue("$Id", id);

        using var reader = await command.ExecuteReaderAsync();

        if (!await reader.ReadAsync())
        {
            return null;
        }
        ;
        return ReadAsTask(reader);
    }

    /// <summary>
    /// Save the task to the database
    /// </summary>
    /// <returns>Number of records affected</returns>
    private async Task<int> Add(string userId, ToDoTask task)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                INSERT INTO Tasks (Id, Title, Description, Status, UserId)
                VALUES ($Id, $Title, $Description, $Status, $UserId)
            """;
        command.Parameters.AddRange(
            [
                new("$Id", task.Id),
                new("$Title", task.Title),
                new("$Status", task.Status),
                new("$UserId", userId),
                task.Description == null
                    ? new("$Description", DBNull.Value)
                    : new($"Description", task.Description),
            ]
        );

        return await command.ExecuteNonQueryAsync();
    }

    /// <summary>
    /// Update an existing task in the database
    /// </summary>
    /// <returns>Number of records affected</returns>
    private async Task<int> Update(string userId, ToDoTask task)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                UPDATE Tasks
                SET Title = $Title, Description = $Description, Status = $Status
                WHERE UserId = $UserId AND Id = $Id
            """;
        command.Parameters.AddRange(
            [
                new("$Id", task.Id),
                new("$Title", task.Title),
                new("$Status", task.Status),
                new("$UserId", userId),
                task.Description == null
                    ? new("$Description", DBNull.Value)
                    : new($"Description", task.Description),
            ]
        );

        return await command.ExecuteNonQueryAsync();
    }

    /// <summary>
    /// Check if a task exists and save or update it
    /// </summary>
    /// <returns>Number of records affected</returns>
    internal async Task<int> AddOrUpdate(string userId, ToDoTask task)
    {
        var existing = await GetTask(userId, task.Id);

        return existing == null ? await Add(userId, task) : await Update(userId, task);
    }

    /// <summary>
    /// Delete a task in the database
    /// </summary>
    /// <returns>Number of records affected</returns>
    internal async Task<int> Delete(string userId, string id)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                DELETE
                FROM Tasks
                WHERE UserId = $UserId AND Id = $Id
            """;
        command.Parameters.AddWithValue("$UserId", userId);
        command.Parameters.AddWithValue("$Id", id);

        return await command.ExecuteNonQueryAsync();
    }

    public void Dispose() => _connection.Dispose();
}
