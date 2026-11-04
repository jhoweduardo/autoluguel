using Autoluguel.Modules;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
var connectionString = builder.Configuration.GetConnectionString("Autoluguel");
builder.Services.AddDbContext<AutoluguelDbContext>(options =>
    options.UseNpgsql(connectionString ?? "Host=localhost;Database=autoluguel;Username=autoluguel;Timeout=3"));

var app = builder.Build();
app.UseExceptionHandler();

app.MapGet("/health/live", () => Results.Ok(new { status = "healthy" }));
app.MapGet("/health/ready", async (AutoluguelDbContext db, CancellationToken cancellationToken) =>
{
    var connected = await db.Database.CanConnectAsync(cancellationToken);
    return connected
        ? Results.Ok(new { status = "ready" })
        : Results.Problem(statusCode: 503, title: "Banco de dados indisponível.");
});
app.MapGet("/api/v1/project-info", () => Results.Ok(new
{
    name = "Autoluguel",
    stage = "scaffold",
    sandbox = true,
    message = "Ambiente de demonstração, sem contratação ou cobrança."
}));

app.Run();

public partial class Program { }
