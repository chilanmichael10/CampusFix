using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusFix.API.Migrations
{
    /// <inheritdoc />
    public partial class AgregarIdentityYCodigoInstitucional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CodigoInstitucional",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodigoInstitucional",
                table: "AspNetUsers");
        }
    }
}
