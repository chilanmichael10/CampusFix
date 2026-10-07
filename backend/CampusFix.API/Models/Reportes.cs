namespace CampusFix.Models;

public class Reporte
{
    public int Id { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string Problema { get; set; } = string.Empty;

    public string Aula { get; set; } = string.Empty;

    public string Prioridad { get; set; } = "Media";

    public string ReportadoPor { get; set; } = string.Empty;

    public string Estado { get; set; } = "Reportado";

    public DateTime FechaReporte { get; set; } = DateTime.UtcNow;

    public DateTime? FechaAsignacion { get; set; }

    public DateTime? FechaResolucion { get; set; }

    // Relaciones
    public int? UsuarioId { get; set; }

    public int? TecnicoId { get; set; }

    public int? CategoriaId { get; set; }

    public int? UbicacionId { get; set; }
}