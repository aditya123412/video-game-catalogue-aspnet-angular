using Microsoft.EntityFrameworkCore;
using video_game_catalogue_aspnet_angular.Server.Data;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core DbContext. Default to SQLite for development; override via configuration for SQL Server.
builder.Services.AddDbContext<video_game_catalogue_aspnet_angular.Server.Data.ApplicationDbContext>(options =>
{
    var sqlServerConn = builder.Configuration.GetConnectionString("SqlServer");
    if (!string.IsNullOrEmpty(sqlServerConn))
    {
        options.UseSqlServer(sqlServerConn);
    }
    else
    {
        var sqliteConn = builder.Configuration.GetConnectionString("Sqlite") ?? "Data Source=app.db";
        options.UseSqlite(sqliteConn);
    }
});

builder.Services.AddScoped<video_game_catalogue_aspnet_angular.Server.Services.IGameService, video_game_catalogue_aspnet_angular.Server.Services.GameService>();


builder.Services.AddControllers();
builder.Services.AddOpenApi();
// Configure CORS to allow the Angular dev server to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAngularDev",
        policy =>
        {
            policy.WithOrigins("https://localhost:51965")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Ensure database is created/migrated on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetService<video_game_catalogue_aspnet_angular.Server.Data.ApplicationDbContext>();
    if (db != null)
    {
        db.Database.EnsureCreated();
    }
}

// Conditional seeding
using (var scope = app.Services.CreateScope())
{
    var config = scope.ServiceProvider.GetService<IConfiguration>();
    var logger = scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("DbSeeder");
    var enabled = config?.GetValue<bool>("SeedData:Enabled") ?? false;
    if (enabled)
    {
        var db = scope.ServiceProvider.GetService<video_game_catalogue_aspnet_angular.Server.Data.ApplicationDbContext>();
        if (db != null && logger != null)
        {
            await video_game_catalogue_aspnet_angular.Server.Data.DbSeeder.SeedAsync(db, logger);
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
// Enable the CORS policy before routing to controllers
app.UseCors("AllowAngularDev");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
