using Microsoft.EntityFrameworkCore;
using CampusFix.Models;

namespace CampusFix.Data;

public class CampusFixDbContext : DbContext
{
    public CampusFixDbContext(DbContextOptions<CampusFixDbContext> options)
        : base(options)
    {
    }

    public DbSet<Reporte> Reportes { get; set; }
}