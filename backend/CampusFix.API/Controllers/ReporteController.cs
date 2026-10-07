using CampusFix.Data;
using CampusFix.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusFix.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReporteController : ControllerBase
{
    private readonly CampusFixDbContext _context;

    public ReporteController(CampusFixDbContext context)
    {
        _context = context;
    }

    // GET: api/Reporte
    // Administradores y técnicos pueden consultar todos los reportes.
    [HttpGet]
    [Authorize(Roles = "Administrador,Técnico")]
    public async Task<ActionResult<IEnumerable<Reporte>>> ObtenerTodos()
    {
        var reportes = await _context.Reportes
            .AsNoTracking()
            .OrderByDescending(r => r.Id)
            .ToListAsync();

        return Ok(reportes);
    }

    // GET: api/Reporte/5
    // Cualquier usuario autenticado puede consultar un reporte.
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Reporte>> ObtenerPorId(int id)
    {
        var reporte = await _context.Reportes
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reporte == null)
        {
            return NotFound(new
            {
                mensaje = $"No existe el reporte con ID {id}."
            });
        }

        return Ok(reporte);
    }

    // POST: api/Reporte
    // Usuarios y administradores pueden crear reportes.
    [HttpPost]
    [Authorize(Roles = "Usuario,Administrador")]
    public async Task<ActionResult<Reporte>> CrearReporte(
        [FromBody] Reporte reporte)
    {
        reporte.Id = 0;
        reporte.Estado = "Reportado";

        if (reporte.FechaReporte == default)
        {
            reporte.FechaReporte = DateTime.UtcNow;
        }

        _context.Reportes.Add(reporte);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(ObtenerPorId),
            new { id = reporte.Id },
            reporte
        );
    }

    // PUT: api/Reporte/5
    // Administradores y técnicos pueden actualizar reportes.
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Administrador,Técnico")]
    public async Task<ActionResult<Reporte>> ActualizarReporte(
        int id,
        [FromBody] Reporte reporte)
    {
        if (id != reporte.Id)
        {
            return BadRequest(new
            {
                mensaje = "El ID de la URL no coincide con el ID del reporte."
            });
        }

        var reporteExistente = await _context.Reportes
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reporteExistente == null)
        {
            return NotFound(new
            {
                mensaje = $"No existe el reporte con ID {id}."
            });
        }

        reporteExistente.Titulo = reporte.Titulo;
        reporteExistente.Problema = reporte.Problema;
        reporteExistente.Aula = reporte.Aula;
        reporteExistente.Prioridad = reporte.Prioridad;
        reporteExistente.ReportadoPor = reporte.ReportadoPor;
        reporteExistente.Estado = reporte.Estado;

        reporteExistente.FechaReporte = reporte.FechaReporte;
        reporteExistente.FechaAsignacion = reporte.FechaAsignacion;
        reporteExistente.FechaResolucion = reporte.FechaResolucion;

        reporteExistente.UsuarioId = reporte.UsuarioId;
        reporteExistente.TecnicoId = reporte.TecnicoId;
        reporteExistente.CategoriaId = reporte.CategoriaId;
        reporteExistente.UbicacionId = reporte.UbicacionId;

        await _context.SaveChangesAsync();

        return Ok(reporteExistente);
    }

    // DELETE: api/Reporte/5
    // Solo administradores pueden eliminar reportes.
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> EliminarReporte(int id)
    {
        var reporte = await _context.Reportes
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reporte == null)
        {
            return NotFound(new
            {
                mensaje = $"No existe el reporte con ID {id}."
            });
        }

        _context.Reportes.Remove(reporte);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}