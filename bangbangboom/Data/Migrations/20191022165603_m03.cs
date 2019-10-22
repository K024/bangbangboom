using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bangbangboom.Data.Migrations
{
    public partial class m03 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Maps_Musics_MusicId",
                table: "Maps");

            migrationBuilder.DropForeignKey(
                name: "FK_PlayRecords_AspNetUsers_UserId",
                table: "PlayRecords");

            migrationBuilder.DropTable(
                name: "AdminRecords");

            migrationBuilder.DropTable(
                name: "LikeDislikes");

            migrationBuilder.DropTable(
                name: "Musics");

            migrationBuilder.DropTable(
                name: "Rates");

            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_PlayRecords_UserId",
                table: "PlayRecords");

            migrationBuilder.DropIndex(
                name: "IX_Maps_MusicId",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Locked",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "MusicId",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Proved",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PlayRecords",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "DateTime",
                table: "PlayRecords",
                nullable: false,
                oldClrType: typeof(DateTime))
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "DateTime",
                table: "Metas",
                nullable: false,
                oldClrType: typeof(DateTime))
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<string>(
                name: "MapName",
                table: "Maps",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "MapContent",
                table: "Maps",
                nullable: true,
                oldClrType: typeof(string));

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "LastModified",
                table: "Maps",
                nullable: false,
                oldClrType: typeof(DateTime))
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn);

            migrationBuilder.AlterColumn<string>(
                name: "ImageFileHashAndType",
                table: "Maps",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "Difficulty",
                table: "Maps",
                nullable: false,
                oldClrType: typeof(double));

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Maps",
                maxLength: 400,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 400);

            migrationBuilder.AddColumn<string>(
                name: "Artist",
                table: "Maps",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Created",
                table: "Maps",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "MusicHash",
                table: "Maps",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MusicName",
                table: "Maps",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "Reviewed",
                table: "Maps",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Maps",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "DateTime",
                table: "Favorites",
                nullable: false,
                oldClrType: typeof(DateTime))
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "DateTime",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(DateTime))
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RegisterDate",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments");

            migrationBuilder.DropColumn(
                name: "Artist",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "MusicHash",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "MusicName",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Reviewed",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Maps");

            migrationBuilder.DropColumn(
                name: "RegisterDate",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "PlayRecords",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "PlayRecords",
                nullable: false,
                oldClrType: typeof(DateTimeOffset))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "Metas",
                nullable: false,
                oldClrType: typeof(DateTimeOffset))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<string>(
                name: "MapName",
                table: "Maps",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MapContent",
                table: "Maps",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "LastModified",
                table: "Maps",
                nullable: false,
                oldClrType: typeof(DateTimeOffset))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn);

            migrationBuilder.AlterColumn<string>(
                name: "ImageFileHashAndType",
                table: "Maps",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "Difficulty",
                table: "Maps",
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Maps",
                maxLength: 400,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 400,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Maps",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Maps",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Locked",
                table: "Maps",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "MusicId",
                table: "Maps",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<bool>(
                name: "Proved",
                table: "Maps",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "Favorites",
                nullable: false,
                oldClrType: typeof(DateTimeOffset))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateTime",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(DateTimeOffset))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified))
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.CreateTable(
                name: "AdminRecords",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    AdminId = table.Column<string>(nullable: false),
                    AffectId = table.Column<string>(maxLength: 50, nullable: false),
                    AffectType = table.Column<string>(maxLength: 20, nullable: false),
                    DateTime = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(maxLength: 100, nullable: false),
                    Detail = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdminRecords_AspNetUsers_AdminId",
                        column: x => x.AdminId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LikeDislikes",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CommentId = table.Column<long>(nullable: false),
                    DateTime = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    IsDislike = table.Column<bool>(nullable: false),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LikeDislikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LikeDislikes_Comments_CommentId",
                        column: x => x.CommentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LikeDislikes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Musics",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Artist = table.Column<string>(maxLength: 100, nullable: false),
                    ArtistUnicode = table.Column<string>(maxLength: 100, nullable: false),
                    Date = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Deleted = table.Column<bool>(nullable: false),
                    Description = table.Column<string>(maxLength: 400, nullable: false),
                    FileHash = table.Column<string>(maxLength: 100, nullable: false),
                    Locked = table.Column<bool>(nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: false),
                    TitleUnicode = table.Column<string>(maxLength: 100, nullable: false),
                    UploaderId = table.Column<string>(maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Musics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Musics_AspNetUsers_UploaderId",
                        column: x => x.UploaderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rates",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Date = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn),
                    MapId = table.Column<long>(nullable: false),
                    RateScore = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rates_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Rates_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Additional = table.Column<string>(maxLength: 200, nullable: true),
                    Date = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    From = table.Column<string>(maxLength: 30, nullable: false),
                    Handled = table.Column<bool>(nullable: false),
                    HandledById = table.Column<string>(nullable: true),
                    LastModified = table.Column<DateTime>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.ComputedColumn),
                    Reason = table.Column<string>(maxLength: 400, nullable: false),
                    Target = table.Column<string>(maxLength: 30, nullable: false),
                    Type = table.Column<string>(maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reports_AspNetUsers_HandledById",
                        column: x => x.HandledById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlayRecords_UserId",
                table: "PlayRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Maps_MusicId",
                table: "Maps",
                column: "MusicId");

            migrationBuilder.CreateIndex(
                name: "IX_AdminRecords_AdminId",
                table: "AdminRecords",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeDislikes_UserId",
                table: "LikeDislikes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeDislikes_CommentId_UserId",
                table: "LikeDislikes",
                columns: new[] { "CommentId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Musics_UploaderId",
                table: "Musics",
                column: "UploaderId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_UserId",
                table: "Rates",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_MapId_UserId",
                table: "Rates",
                columns: new[] { "MapId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_HandledById",
                table: "Reports",
                column: "HandledById");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId",
                principalTable: "Comments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Maps_Musics_MusicId",
                table: "Maps",
                column: "MusicId",
                principalTable: "Musics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayRecords_AspNetUsers_UserId",
                table: "PlayRecords",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
