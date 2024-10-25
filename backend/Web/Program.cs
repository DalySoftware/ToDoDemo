using Microsoft.AspNetCore.Authentication.Cookies;
using ToDoDemoBackend.Web;
using ToDoDemoBackend.Web.Apis;
using ToDoDemoBackend.Web.Auth;
using ToDoDemoBackend.Web.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddEndpointsApiExplorer()
    .AddSwaggerGen()
    .AddCors()
    .AddToDoDemoServices()
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme);

await SqliteUtilities.CreateTaskTableIfNotExists();

var app = builder.Build();

app.UseMiddleware<CookieAuthenticationMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(policy =>
    policy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins(
            "https://black-moss-006d92a1e.5.azurestaticapps.net",
            "http://localhost:5173",
            "https://localhost:7178"
        )
        .AllowCredentials()
);

app.UseHttpsRedirection();
app.MapTaskApis();

app.Run();
