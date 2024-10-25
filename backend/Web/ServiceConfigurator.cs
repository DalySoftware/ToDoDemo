using ToDoDemoBackend.Web.Auth;
using ToDoDemoBackend.Web.Persistence;

namespace ToDoDemoBackend.Web;

internal static class ServiceConfigurator
{
    internal static IServiceCollection AddToDoDemoServices(this IServiceCollection services) =>
        services.AddTransient<TaskRepository>().AddTransient<CookieAuthenticationMiddleware>();
}
