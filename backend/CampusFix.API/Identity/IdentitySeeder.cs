using CampusFix.Identity;
using Microsoft.AspNetCore.Identity;

namespace CampusFix.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(
        IServiceProvider serviceProvider)
    {
        var roleManager =
            serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

        var userManager =
            serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // =========================================================
        // ROLES
        // =========================================================

        string[] roles =
        [
            "Administrador",
            "Usuario",
            "Técnico"
        ];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(
                    new IdentityRole<int>(role));

                if (!result.Succeeded)
                {
                    throw new Exception(
                        $"No se pudo crear el rol {role}: " +
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }

        // =========================================================
        // USUARIOS DE PRUEBA
        // =========================================================

        await CreateUserAsync(
            userManager,
            email: "admin.pruebas@campusfix.local",
            password: "CampusFix.Admin2026!",
            nombreCompleto: "Administrador de Pruebas",
            codigoInstitucional: "ADM-TEST-001",
            role: "Administrador");

        await CreateUserAsync(
            userManager,
            email: "tecnico.pruebas@campusfix.local",
            password: "CampusFix.Tecnico2026!",
            nombreCompleto: "Técnico de Pruebas",
            codigoInstitucional: "TEC-TEST-001",
            role: "Técnico");

        await CreateUserAsync(
            userManager,
            email: "usuario.pruebas@campusfix.local",
            password: "CampusFix.Usuario2026!",
            nombreCompleto: "Usuario de Pruebas",
            codigoInstitucional: "USR-TEST-001",
            role: "Usuario");
    }

    private static async Task CreateUserAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string password,
        string nombreCompleto,
        string codigoInstitucional,
        string role)
    {
        var existingUser = await userManager.FindByEmailAsync(email);

        if (existingUser is not null)
        {
            // Garantizamos que conserve el rol correcto.
            if (!await userManager.IsInRoleAsync(existingUser, role))
{
    var existingUserRoleResult =
        await userManager.AddToRoleAsync(existingUser, role);

    if (!existingUserRoleResult.Succeeded)
    {
        throw new Exception(
            $"No se pudo asignar el rol {role} a {email}: " +
            string.Join(
                ", ",
                existingUserRoleResult.Errors.Select(e => e.Description)));
    }
}

            return;
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            NombreCompleto = nombreCompleto,
            CodigoInstitucional = codigoInstitucional
        };

        var createResult =
            await userManager.CreateAsync(user, password);

        if (!createResult.Succeeded)
        {
            throw new Exception(
                $"No se pudo crear el usuario {email}: " +
                string.Join(
                    ", ",
                    createResult.Errors.Select(e => e.Description)));
        }

        var roleResult =
            await userManager.AddToRoleAsync(user, role);

        if (!roleResult.Succeeded)
        {
            throw new Exception(
                $"No se pudo asignar el rol {role} a {email}: " +
                string.Join(
                    ", ",
                    roleResult.Errors.Select(e => e.Description)));
        }
    }
}