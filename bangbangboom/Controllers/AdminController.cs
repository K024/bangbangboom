using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        private readonly UserManager<AppUser> userManager;
        public AdminController(
            UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpPost]
        public async Task<object> ModifyMusicInfo(
            [FromForm][Required] long id,
            [FromForm][MaxLength(100)]string title,
            [FromForm][MaxLength(100)]string artist,
            [FromForm][MaxLength(100)]string titleUnicode,
            [FromForm][MaxLength(100)]string artistUnicode,
            [FromForm][MaxLength(400)]string description,
            [FromForm][Required][MaxLength(100)] string detail,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var music = await context.Musics.FindAsync(id);

            if (music is null || music.Deleted) return StatusCode(404);

            if (title != null) music.Title = title;
            if (artist != null) music.Artist = artist;
            if (titleUnicode != null) music.TitleUnicode = titleUnicode;
            if (artistUnicode != null) music.ArtistUnicode = artistUnicode;
            if (description != null) music.Description = description;

            await context.AdminRecords.AddAsync(new AdminRecord()
            {
                Admin = await userManager.GetUserAsync(User),
                Description = "Modify music info",
                Detail = detail,
                AffectType = "music",
                AffectId = id.ToString()
            });

            await context.SaveChangesAsync();
            return Ok();
        }


        [HttpPost]
        public async Task<object> LockMusic(
            [FromForm][Required] long musicid,
            [FromForm][Required][MaxLength(100)] string detail,
            [FromServices] AppDbContext context)
        {
            var m = await context.Musics.FindAsync(musicid);
            if (m is null || m.Deleted) return StatusCode(404);

            m.Locked = true;
            await context.AdminRecords.AddAsync(new AdminRecord()
            {
                Admin = await userManager.GetUserAsync(User),
                Description = "Lock music",
                Detail = detail,
                AffectType = "music",
                AffectId = musicid.ToString()
            });
            await context.SaveChangesAsync();

            return Ok();
        }


        [HttpPost]
        public async Task<object> ModifyMapInfo(
            [FromForm][Required] int id,
            [FromForm][MaxLength(100)] string mapName,
            [FromForm][Range(0, 100)] int? difficulty,
            [FromForm][MaxLength(400)] string description,
            [FromForm][Required][MaxLength(100)] string detail,
            [FromServices] AppDbContext context)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted) return StatusCode(404);

            if (mapName != null) map.MapName = mapName;
            if (difficulty != null) map.Difficulty = difficulty ?? 20;
            if (description != null) map.Description = description;

            await context.AdminRecords.AddAsync(new AdminRecord()
            {
                Admin = await userManager.GetUserAsync(User),
                Description = "Modify map info",
                Detail = detail,
                AffectType = "map",
                AffectId = id.ToString()
            });

            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<object> ProveMap(
            [FromForm][Required] long mapid,
            [FromServices] AppDbContext context)
        {
            var m = await context.Maps.FindAsync(mapid);
            if (m is null || m.Deleted) return StatusCode(404);

            m.Proved = true;
            await context.AdminRecords.AddAsync(new AdminRecord()
            {
                Admin = await userManager.GetUserAsync(User),
                Description = "Prove map",
                Detail = "none",
                AffectType = "map",
                AffectId = mapid.ToString()
            });
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<object> LockMap(
            [FromForm][Required] long mapid,
            [FromForm][Required][MaxLength(100)] string detail,
            [FromServices] AppDbContext context)
        {
            var m = await context.Maps.FindAsync(mapid);
            if (m is null || m.Deleted) return StatusCode(404);

            m.Locked = true;
            await context.AdminRecords.AddAsync(new AdminRecord()
            {
                Admin = await userManager.GetUserAsync(User),
                Description = "Lock map",
                Detail = detail,
                AffectType = "map",
                AffectId = mapid.ToString()
            });
            await context.SaveChangesAsync();

            return Ok();
        }


        [HttpPost]
        public async Task<object> LockComment(
            [FromForm][Required] long commentid,
            [FromForm][Required][MaxLength(100)] string detail,
            [FromServices] AppDbContext context)
        {
            var c = await context.Comments.FindAsync(commentid);
            if (c is null || c.Locked) return StatusCode(404);

            c.Locked = true;
            await context.AdminRecords.AddAsync(new AdminRecord()
            {
                Admin = await userManager.GetUserAsync(User),
                Description = "Lock comment",
                Detail = detail,
                AffectType = "comment",
                AffectId = commentid.ToString()
            });
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet]
        public object Reports(
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var reports =
                from r in context.Reports
                orderby r.Date descending
                select ReportDetail.FromReport(r);
            var p = page ?? 1 - 1;
            return reports.Skip(p * 48).Take(48);
        }

        [HttpGet]
        public object UnhandledReports(
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var reports =
                from r in context.Reports
                where !r.Handled
                orderby r.Date descending
                select ReportDetail.FromReport(r);
            var p = page ?? 1 - 1;
            return reports.Skip(p * 48).Take(48);
        }

        [HttpPost]
        public async Task<object> HandleReport(
            [FromForm][Required] long id,
            [FromForm][MaxLength(200)] string additional,
            [FromServices] AppDbContext context)
        {
            var report = await context.Reports.FindAsync(id);
            if (report is null || report.Handled) return StatusCode(404);

            report.Handled = true;
            report.HandledBy = await userManager.GetUserAsync(User);
            report.Additional = additional;

            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
