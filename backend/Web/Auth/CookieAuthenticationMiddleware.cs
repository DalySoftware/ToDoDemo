namespace ToDoDemoBackend.Web.Auth;

/// <summary>
/// This is a very simple authentication mode which just identifies the user based on cookie.
/// Eg they have no ability to share data across browsers.
/// </summary>
public class CookieAuthenticationMiddleware : IMiddleware
{
    private static CookieOptions _options =
        new()
        {
            Expires = DateTimeOffset.MaxValue,
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
        };

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.Request.Cookies.TryGetValue(CookieAuthentication.UserId, out var userId))
        {
            context.Items[CookieAuthentication.UserId] = userId;
            await next(context);
            return;
        }

        var newId = Guid.NewGuid().ToString();
        context.Response.Cookies.Append(CookieAuthentication.UserId, newId, _options);
        context.Items[CookieAuthentication.UserId] = newId;

        await next(context);
    }
}

internal static class CookieAuthentication
{
    public const string UserId = "UserId";

    internal static string GetUserIdOrThrow(this HttpContext context) =>
        context.Items[UserId] as string ?? throw new MissingUserIdException();

    public class MissingUserIdException : Exception
    {
        public MissingUserIdException()
            : base("Could not identify the user") { }
    }
}
