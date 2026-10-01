using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusFix.API.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarModeloReporte : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoriaId",
                table: "Reportes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaAsignacion",
                table: "Reportes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaResolucion",
                table: "Reportes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TecnicoId",
                table: "Reportes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Titulo",
                table: "Reportes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UbicacionId",
                table: "Reportes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Reportes",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoriaId",
                table: "Reportes");

            migrationBuilder.DropColumn(
                name: "FechaAsignacion",
                table: "Reportes");

            migrationBuilder.DropColumn(
                name: "FechaResolucion",
                table: "Reportes");

            migrationBuilder.DropColumn(
                name: "TecnicoId",
                table: "Reportes");

            migrationBuilder.DropColumn(
                name: "Titulo",
                table: "Reportes");

            migrationBuilder.DropColumn(
                name: "UbicacionId",
                table: "Reportes");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Reportes");
        }
    }
}
