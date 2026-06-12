using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmFresh.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCsaWeeklyBox : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CsaWeeklyBox",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CsaSubscriptionId = table.Column<Guid>(type: "uuid", nullable: false),
                    WeekNumber = table.Column<int>(type: "integer", nullable: false),
                    DeliveryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CsaWeeklyBox", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CsaWeeklyBox_CsaSubscriptions_CsaSubscriptionId",
                        column: x => x.CsaSubscriptionId,
                        principalTable: "CsaSubscriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CsaWeeklyBoxItem",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CsaWeeklyBoxId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CsaWeeklyBoxItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CsaWeeklyBoxItem_CsaWeeklyBox_CsaWeeklyBoxId",
                        column: x => x.CsaWeeklyBoxId,
                        principalTable: "CsaWeeklyBox",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CsaWeeklyBoxItem_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CsaWeeklyBox_CsaSubscriptionId",
                table: "CsaWeeklyBox",
                column: "CsaSubscriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_CsaWeeklyBoxItem_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItem",
                column: "CsaWeeklyBoxId");

            migrationBuilder.CreateIndex(
                name: "IX_CsaWeeklyBoxItem_ProductId",
                table: "CsaWeeklyBoxItem",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CsaWeeklyBoxItem");

            migrationBuilder.DropTable(
                name: "CsaWeeklyBox");
        }
    }
}
