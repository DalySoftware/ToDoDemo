using ToDoDemoBackend.Web;
using ToDoDemoBackend.Web.Apis;
using ToDoDemoBackend.Web.Models;
using ToDoDemoBackend.Web.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer().AddSwaggerGen().AddToDoDemoServices();

await SqliteUtilities.CreateTaskTableIfNotExists();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapTaskApis();

app.UseHttpsRedirection();

app.Run();
