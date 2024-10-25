using Microsoft.Data.Sqlite;

namespace ToDoDemoBackend.Web.Persistence;

internal class SqliteUtilities
{
    internal static async Task CreateTaskTableIfNotExists()
    {
        // This is a simple way to manage the database schema for the purpose of this demo.
        const string script = """
                CREATE TABLE IF NOT EXISTS Tasks (
                    Id TEXT PRIMARY KEY,
                    Title TEXT NOT NULL,
                    Description TEXT NULL,
                    Status TEXT NULL
                )
            """;

        using var connection = GetDbConnection();
        await connection.OpenAsync();
        var command = connection.CreateCommand();
        command.CommandText = script;

        await command.ExecuteNonQueryAsync();
    }

    internal static SqliteConnection GetDbConnection() => new("Data Source=sqlite.db");
}
