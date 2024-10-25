using ToDoDemoBackend.Web.Persistence;

namespace ToDoDemoBackend.Web;

internal static class ServiceConfigurator
{
    internal static void AddToDoDemoServices(this IServiceCollection services) =>
        services.AddTransient<TaskRepository>();
}
