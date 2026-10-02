using CampusFix.Identity;
using CampusFix.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CampusFix.Data;

public class CampusFixDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public CampusFixDbContext(DbContextOptions<CampusFixDbContext> options)
        : base(options)
    {
    }

    public DbSet<Reporte> Reportes { get; set; }
}
