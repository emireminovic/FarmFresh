using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FarmFresh.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCsaBoxTemplate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CsaWeeklyBox_CsaSubscriptions_CsaSubscriptionId",
                table: "CsaWeeklyBox");

            migrationBuilder.DropForeignKey(
                name: "FK_CsaWeeklyBoxItem_CsaWeeklyBox_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItem");

            migrationBuilder.DropForeignKey(
                name: "FK_CsaWeeklyBoxItem_Products_ProductId",
                table: "CsaWeeklyBoxItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CsaWeeklyBoxItem",
                table: "CsaWeeklyBoxItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CsaWeeklyBox",
                table: "CsaWeeklyBox");

            migrationBuilder.RenameTable(
                name: "CsaWeeklyBoxItem",
                newName: "CsaWeeklyBoxItems");

            migrationBuilder.RenameTable(
                name: "CsaWeeklyBox",
                newName: "CsaWeeklyBoxes");

            migrationBuilder.RenameIndex(
                name: "IX_CsaWeeklyBoxItem_ProductId",
                table: "CsaWeeklyBoxItems",
                newName: "IX_CsaWeeklyBoxItems_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_CsaWeeklyBoxItem_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItems",
                newName: "IX_CsaWeeklyBoxItems_CsaWeeklyBoxId");

            migrationBuilder.RenameIndex(
                name: "IX_CsaWeeklyBox_CsaSubscriptionId",
                table: "CsaWeeklyBoxes",
                newName: "IX_CsaWeeklyBoxes_CsaSubscriptionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CsaWeeklyBoxItems",
                table: "CsaWeeklyBoxItems",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CsaWeeklyBoxes",
                table: "CsaWeeklyBoxes",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "CsaBoxTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FarmerProfileId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CsaBoxTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CsaBoxTemplates_FarmerProfiles_FarmerProfileId",
                        column: x => x.FarmerProfileId,
                        principalTable: "FarmerProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CsaBoxTemplateItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CsaBoxTemplateId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CsaBoxTemplateItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CsaBoxTemplateItems_CsaBoxTemplates_CsaBoxTemplateId",
                        column: x => x.CsaBoxTemplateId,
                        principalTable: "CsaBoxTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CsaBoxTemplateItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CsaBoxTemplateItems_CsaBoxTemplateId",
                table: "CsaBoxTemplateItems",
                column: "CsaBoxTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_CsaBoxTemplateItems_ProductId",
                table: "CsaBoxTemplateItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_CsaBoxTemplates_FarmerProfileId",
                table: "CsaBoxTemplates",
                column: "FarmerProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_CsaWeeklyBoxes_CsaSubscriptions_CsaSubscriptionId",
                table: "CsaWeeklyBoxes",
                column: "CsaSubscriptionId",
                principalTable: "CsaSubscriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CsaWeeklyBoxItems_CsaWeeklyBoxes_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItems",
                column: "CsaWeeklyBoxId",
                principalTable: "CsaWeeklyBoxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CsaWeeklyBoxItems_Products_ProductId",
                table: "CsaWeeklyBoxItems",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CsaWeeklyBoxes_CsaSubscriptions_CsaSubscriptionId",
                table: "CsaWeeklyBoxes");

            migrationBuilder.DropForeignKey(
                name: "FK_CsaWeeklyBoxItems_CsaWeeklyBoxes_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItems");

            migrationBuilder.DropForeignKey(
                name: "FK_CsaWeeklyBoxItems_Products_ProductId",
                table: "CsaWeeklyBoxItems");

            migrationBuilder.DropTable(
                name: "CsaBoxTemplateItems");

            migrationBuilder.DropTable(
                name: "CsaBoxTemplates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CsaWeeklyBoxItems",
                table: "CsaWeeklyBoxItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CsaWeeklyBoxes",
                table: "CsaWeeklyBoxes");

            migrationBuilder.RenameTable(
                name: "CsaWeeklyBoxItems",
                newName: "CsaWeeklyBoxItem");

            migrationBuilder.RenameTable(
                name: "CsaWeeklyBoxes",
                newName: "CsaWeeklyBox");

            migrationBuilder.RenameIndex(
                name: "IX_CsaWeeklyBoxItems_ProductId",
                table: "CsaWeeklyBoxItem",
                newName: "IX_CsaWeeklyBoxItem_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_CsaWeeklyBoxItems_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItem",
                newName: "IX_CsaWeeklyBoxItem_CsaWeeklyBoxId");

            migrationBuilder.RenameIndex(
                name: "IX_CsaWeeklyBoxes_CsaSubscriptionId",
                table: "CsaWeeklyBox",
                newName: "IX_CsaWeeklyBox_CsaSubscriptionId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CsaWeeklyBoxItem",
                table: "CsaWeeklyBoxItem",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CsaWeeklyBox",
                table: "CsaWeeklyBox",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CsaWeeklyBox_CsaSubscriptions_CsaSubscriptionId",
                table: "CsaWeeklyBox",
                column: "CsaSubscriptionId",
                principalTable: "CsaSubscriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CsaWeeklyBoxItem_CsaWeeklyBox_CsaWeeklyBoxId",
                table: "CsaWeeklyBoxItem",
                column: "CsaWeeklyBoxId",
                principalTable: "CsaWeeklyBox",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CsaWeeklyBoxItem_Products_ProductId",
                table: "CsaWeeklyBoxItem",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
