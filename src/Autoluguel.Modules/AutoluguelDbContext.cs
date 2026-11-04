using Microsoft.EntityFrameworkCore;

namespace Autoluguel.Modules;

// Scaffold de conexão; entidades e migrations entram por história do backlog.
public sealed class AutoluguelDbContext(DbContextOptions<AutoluguelDbContext> options)
    : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AutoluguelDbContext).Assembly);
    }
}
