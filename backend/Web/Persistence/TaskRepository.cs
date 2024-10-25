using System.Diagnostics;
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

    internal async Task<IReadOnlyCollection<ToDoTask>> GetAllTasks()
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                SELECT Id, Title, Description, Status
                FROM Tasks
            """;

        using var reader = await command.ExecuteReaderAsync();
        var tasks = new List<ToDoTask>();

        while (await reader.ReadAsync())
        {
            var task = ReadAsTask(reader);
            tasks.Add(task);
        }

        return tasks;
    }

    internal async Task<ToDoTask?> GetTask(string id)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                SELECT Id, Title, Description, Status
                FROM Tasks
                WHERE Id = $Id
            """;
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
    private async Task<int> Add(ToDoTask task)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                INSERT INTO Tasks (Id, Title, Description, Status)
                VALUES ($Id, $Title, $Description, $Status)
            """;
        command.Parameters.AddRange(
            [
                new("$Id", task.Id),
                new("$Title", task.Title),
                new("$Status", task.Status),
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
    private async Task<int> Update(ToDoTask task)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                UPDATE Tasks
                SET Title = $Title, Description = $Description, Status = $Status
                WHERE Id = $Id
            """;
        command.Parameters.AddRange(
            [
                new("$Id", task.Id),
                new("$Title", task.Title),
                new("$Status", task.Status),
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
    internal async Task<int> AddOrUpdate(ToDoTask task)
    {
        var existing = await GetTask(task.Id);

        return existing == null ? await Add(task) : await Update(task);
    }

    /// <summary>
    /// Delete a task in the database
    /// </summary>
    /// <returns>Number of records affected</returns>
    internal async Task<int> Delete(string id)
    {
        await _connection.OpenAsync();
        var command = _connection.CreateCommand();
        command.CommandText = """
                DELETE
                FROM Tasks
                WHERE Id = $Id
            """;
        command.Parameters.AddWithValue("$Id", id);

        return await command.ExecuteNonQueryAsync();
    }

    public void Dispose() => _connection.Dispose();
}
