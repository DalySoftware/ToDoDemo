using ToDoDemoBackend.Web;
using ToDoDemoBackend.Web.Apis;
using ToDoDemoBackend.Web.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer().AddSwaggerGen().AddCors().AddToDoDemoServices();

await SqliteUtilities.CreateTaskTableIfNotExists();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// Disable CORS validation for the sake of this project
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

app.UseHttpsRedirection();
app.MapTaskApis();

app.Run();
