using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace bangbangboom.Data.Migrations
{
    public partial class migration01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NickName",
                table: "AspNetUsers",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileFileHash",
                table: "AspNetUsers",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WhatsUp",
                table: "AspNetUsers",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddUniqueConstraint(
                name: "AK_AspNetUsers_UserName",
                table: "AspNetUsers",
                column: "UserName");

            migrationBuilder.CreateTable(
                name: "Musics",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UploaderName = table.Column<string>(maxLength: 50, nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: true),
                    TitleUnicode = table.Column<string>(maxLength: 100, nullable: true),
                    Artist = table.Column<string>(maxLength: 100, nullable: true),
                    ArtistUnicode = table.Column<string>(maxLength: 100, nullable: true),
                    Description = table.Column<string>(maxLength: 400, nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    FileHash = table.Column<string>(maxLength: 100, nullable: true),
                    Locked = table.Column<bool>(nullable: false),
                    Deleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Musics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Musics_AspNetUsers_UploaderName",
                        column: x => x.UploaderName,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Maps",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UploaderName = table.Column<string>(nullable: false),
                    MusicId = table.Column<long>(nullable: false),
                    MapName = table.Column<string>(maxLength: 100, nullable: true),
                    Description = table.Column<string>(maxLength: 400, nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    MapContent = table.Column<string>(nullable: true),
                    ImageFileHash = table.Column<string>(maxLength: 100, nullable: true),
                    Proved = table.Column<bool>(nullable: false),
                    Locked = table.Column<bool>(nullable: false),
                    Deleted = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Maps_Musics_MusicId",
                        column: x => x.MusicId,
                        principalTable: "Musics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Maps_AspNetUsers_UploaderName",
                        column: x => x.UploaderName,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: false),
                    MapId = table.Column<long>(nullable: false),
                    ParentCommentId = table.Column<long>(nullable: true),
                    DateTime = table.Column<DateTime>(nullable: false),
                    Content = table.Column<string>(maxLength: 200, nullable: true),
                    Locked = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Comments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "Comments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Comments_AspNetUsers_Username",
                        column: x => x.Username,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Favorite",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: false),
                    MapId = table.Column<long>(nullable: false),
                    DateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorite", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favorite_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Favorite_AspNetUsers_Username",
                        column: x => x.Username,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlayRecord",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: false),
                    MapId = table.Column<long>(nullable: false),
                    DateTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayRecord_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayRecord_AspNetUsers_Username",
                        column: x => x.Username,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Rates",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: false),
                    MapId = table.Column<long>(nullable: false),
                    RateScore = table.Column<int>(nullable: false)
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
                        name: "FK_Rates_AspNetUsers_Username",
                        column: x => x.Username,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LikeDislikes",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(nullable: false),
                    CommentId = table.Column<long>(nullable: false),
                    IsDislike = table.Column<bool>(nullable: false)
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
                        name: "FK_LikeDislikes_AspNetUsers_Username",
                        column: x => x.Username,
                        principalTable: "AspNetUsers",
                        principalColumn: "UserName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_MapId",
                table: "Comments",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_Username",
                table: "Comments",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_Favorite_Username",
                table: "Favorite",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_Favorite_MapId_Username",
                table: "Favorite",
                columns: new[] { "MapId", "Username" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LikeDislikes_Username",
                table: "LikeDislikes",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_LikeDislikes_CommentId_Username",
                table: "LikeDislikes",
                columns: new[] { "CommentId", "Username" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Maps_MusicId",
                table: "Maps",
                column: "MusicId");

            migrationBuilder.CreateIndex(
                name: "IX_Maps_UploaderName",
                table: "Maps",
                column: "UploaderName");

            migrationBuilder.CreateIndex(
                name: "IX_Musics_UploaderName",
                table: "Musics",
                column: "UploaderName");

            migrationBuilder.CreateIndex(
                name: "IX_PlayRecord_MapId",
                table: "PlayRecord",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayRecord_Username",
                table: "PlayRecord",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_Username",
                table: "Rates",
                column: "Username");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_MapId_Username",
                table: "Rates",
                columns: new[] { "MapId", "Username" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Favorite");

            migrationBuilder.DropTable(
                name: "LikeDislikes");

            migrationBuilder.DropTable(
                name: "PlayRecord");

            migrationBuilder.DropTable(
                name: "Rates");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Maps");

            migrationBuilder.DropTable(
                name: "Musics");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_AspNetUsers_UserName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NickName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ProfileFileHash",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "WhatsUp",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "UserName",
                table: "AspNetUsers",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 256);
        }
    }
}
