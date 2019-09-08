using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bangbangboom.Data.Migrations
{
    public partial class m02 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayRecords_AspNetUsers_UserId",
                table: "PlayRecords");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PlayRecords",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.CreateTable(
                name: "Metas",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Usage = table.Column<string>(maxLength: 100, nullable: false),
                    Key = table.Column<string>(maxLength: 200, nullable: false),
                    Value = table.Column<string>(nullable: true),
                    DateTime = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Metas", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Metas_Usage",
                table: "Metas",
                column: "Usage");

            migrationBuilder.CreateIndex(
                name: "IX_Metas_Usage_Key",
                table: "Metas",
                columns: new[] { "Usage", "Key" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayRecords_AspNetUsers_UserId",
                table: "PlayRecords",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayRecords_AspNetUsers_UserId",
                table: "PlayRecords");

            migrationBuilder.DropTable(
                name: "Metas");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PlayRecords",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayRecords_AspNetUsers_UserId",
                table: "PlayRecords",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
