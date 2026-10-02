using CampusFix.Identity;
using Microsoft.AspNetCore.Identity;

namespace CampusFix.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager =
            services.GetRequiredService<RoleManager<IdentityRole<int>>>();

        var userManager =
            services.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles =
        {
            "Administrador",
            "Usuario",
            "Técnico"
        };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(
                    new IdentityRole<int>(role));
            }
        }

        const string adminEmail = "admin@campusfix.local";
        const string adminPassword = "AdminCampusFix2026";

        var admin = await userManager.FindByEmailAsync(adminEmail);

        if (admin is null)
        {
            admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                NombreCompleto = "Administrador CampusFix",
                CodigoInstitucional = "ADMIN-001"
            };

            var result = await userManager.CreateAsync(
                admin,
                adminPassword);

            if (!result.Succeeded)
            {
                throw new InvalidOperationException(
                    string.Join(
                        "; ",
                        result.Errors.Select(e => e.Description)));
            }
        }

        if (!await userManager.IsInRoleAsync(admin, "Administrador"))
        {
            await userManager.AddToRoleAsync(
                admin,
                "Administrador");
        }
    }
}