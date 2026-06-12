using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmFresh.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFarmerProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Certificates",
                table: "FarmerProfiles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsOpenFarm",
                table: "FarmerProfiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Photos",
                table: "FarmerProfiles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Certificates",
                table: "FarmerProfiles");

            migrationBuilder.DropColumn(
                name: "IsOpenFarm",
                table: "FarmerProfiles");

            migrationBuilder.DropColumn(
                name: "Photos",
                table: "FarmerProfiles");
        }
    }
}
