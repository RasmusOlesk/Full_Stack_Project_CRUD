using Microsoft.EntityFrameworkCore;
using TaskManager.api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://rasmusolesk.github.io")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });

    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// IMPORTANT: Use the LOCAL policy during development
app.UseCors("Frontend");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
