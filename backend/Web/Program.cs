using Google.Apis.Auth.AspNetCore3;
using Microsoft.AspNetCore.Authentication.Cookies;
using ToDoDemoBackend.Web;
using ToDoDemoBackend.Web.Apis;
using ToDoDemoBackend.Web.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .AddToDoDemoServices()
    .AddAuthorization()
    .AddAuthentication(options =>
    {
        options.DefaultChallengeScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;
        options.DefaultForbidScheme = GoogleOpenIdConnectDefaults.AuthenticationScheme;
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie()
    .AddGoogleOpenIdConnect(options =>
    {
        options.ClientId =
            "762528976735-ru900278kll5b7vcdjm7slebki3geq4j.apps.googleusercontent.com";
        options.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_OAUTH_CLIENT_SECRET");
    });

builder.Services.AddCors(options =>
    options.AddPolicy(
        "AllowAll",
        policy => policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod()
    )
);

await SqliteUtilities.CreateTaskTableIfNotExists();

var app = builder.Build();

app.UseSwagger().UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthentication();

// Disable CORS validation for the sake of this project
app.UseAuthorization();
app.UseCors("AllowAll");

app.MapTaskApis();

app.Run();
