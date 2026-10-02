using Microsoft.AspNetCore.Identity;

namespace CampusFix.Identity;

public class ApplicationUser : IdentityUser<int>
{
    public string NombreCompleto { get; set; } = string.Empty;

    public string CodigoInstitucional { get; set; } = string.Empty;
}
