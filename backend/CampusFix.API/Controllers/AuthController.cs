using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CampusFix.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CampusFix.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var existingEmail = await _userManager.FindByEmailAsync(request.Email);

        if (existingEmail is not null)
        {
            return BadRequest(new
            {
                message = "El correo electrónico ya está registrado."
            });
        }

        var existingCode = _userManager.Users
            .FirstOrDefault(u => u.CodigoInstitucional == request.CodigoInstitucional);

        if (existingCode is not null)
        {
            return BadRequest(new
            {
                message = "El código institucional ya está registrado."
            });
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            NombreCompleto = request.NombreCompleto,
            CodigoInstitucional = request.CodigoInstitucional
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                message = "No se pudo crear el usuario.",
                errors = result.Errors.Select(e => e.Description)
            });
        }

        // Por seguridad, el registro público siempre crea usuarios normales.
        await _userManager.AddToRoleAsync(user, "Usuario");

        return Ok(new
        {
            message = "Usuario registrado correctamente.",
            userId = user.Id
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Correo o contraseña incorrectos."
            });
        }

        var passwordValid = await _userManager.CheckPasswordAsync(
            user,
            request.Password);

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Correo o contraseña incorrectos."
            });
        }

        var roles = await _userManager.GetRolesAsync(user);

        var token = GenerateJwtToken(user, roles);

        return Ok(new
        {
            token,
            user = new
            {
                id = user.Id,
                nombreCompleto = user.NombreCompleto,
                email = user.Email,
                codigoInstitucional = user.CodigoInstitucional,
                roles
            }
        });
    }

    private string GenerateJwtToken(
        ApplicationUser user,
        IList<string> roles)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("No se configuró Jwt:Key.");

        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("No se configuró Jwt:Issuer.");

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.NombreCompleto),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new("CodigoInstitucional", user.CodigoInstitucional)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: issuer,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record RegisterRequest(
    string NombreCompleto,
    string CodigoInstitucional,
    string Email,
    string Password);

public record LoginRequest(
    string Email,
    string Password);