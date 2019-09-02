using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using bangbangboom.Services;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Identity;

namespace bangbangboom.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MusicController : ControllerBase
    {

        private readonly UserManager<AppUser> userManager;
        public MusicController(
            UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<object> Info(
            [FromQuery][Required]long id,
            [FromServices] AppDbContext context)
        {
            var music = await context.Musics.FindAsync(id);
            if (music is null || music.Deleted) return StatusCode(404);
            return MusicDetailed.FromMusic(music);
        }

        [HttpGet]
        public object Search(
            [FromQuery][Required] string key,
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var musics =
                from m in context.Musics
                where (m.Artist.Contains(key) || m.ArtistUnicode.Contains(key)
                || m.Title.Contains(key) || m.TitleUnicode.Contains(key)
                || m.Description.Contains(key)) && !m.Deleted
                select MusicShort.FromMusic(m);
            var p = page ?? 1 - 1;
            return musics.Skip(p * 48).Take(48);
        }


        [HttpGet]
        public object Latest(
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var musics =
                from m in context.Musics
                where !m.Deleted
                orderby m.Date descending
                select MusicShort.FromMusic(m);
            var p = page ?? 1 - 1;
            return musics.Skip(p * 48).Take(48);
        }


        [HttpGet("{id}")]
        public async Task<object> File(
            [Required]long id,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext context)
        {
            var music = await context.Musics.FindAsync(id);
            if (music is null || music.Deleted)
                return StatusCode(404);
            if (music.Locked)
                return StatusCode(403);

            var fs = fileProvider.GetFileByHash(music.FileHash);
            return File(fs, "audio/mp3", music.Title + ".mp3", null,
                EntityTagHeaderValue.Parse(new StringSegment('"' + music.FileHash + '"')), true);

        }

        [Authorize]
        [HttpPost]
        public async Task<object> UpLoad(
            [FromForm][Required]IFormFile file,
            [FromForm][Required][MaxLength(100)]string title,
            [FromForm][Required][MaxLength(100)]string artist,
            [FromForm][Required][MaxLength(100)]string titleUnicode,
            [FromForm][Required][MaxLength(100)]string artistUnicode,
            [FromForm][Required][MaxLength(400)]string description,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            if (file.ContentType != "audio/mp3" ||
                file.Length > 1024 * 1024 * 5 ||
                title.Any(c => c > 127) ||
                artist.Any(c => c > 127))
                return StatusCode(400);

            var music = new Music
            {
                Uploader = user,
                Title = title,
                TitleUnicode = titleUnicode,
                Artist = artist,
                ArtistUnicode = artistUnicode,
                Description = description,
                FileHash = await fileProvider.SaveFileAsync(file.OpenReadStream())
            };
            context.Musics.Add(music);
            await context.SaveChangesAsync();
            return Ok(music.Id);
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Modify(
            [FromForm][Required] long id,
            [FromForm][MaxLength(100)]string title,
            [FromForm][MaxLength(100)]string artist,
            [FromForm][MaxLength(100)]string titleUnicode,
            [FromForm][MaxLength(100)]string artistUnicode,
            [FromForm][MaxLength(400)]string description,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var music = await context.Musics.FindAsync(id);

            if (music is null || music.Deleted) return StatusCode(404);
            if (music.Uploader != user) return StatusCode(403);

            if ((title != null && title.Any(c => c > 127)) ||
                (artist != null && artist.Any(c => c > 127)))
                return StatusCode(400);

            if (title != null) music.Title = title;
            if (artist != null) music.Artist = artist;
            if (titleUnicode != null) music.TitleUnicode = titleUnicode;
            if (artistUnicode != null) music.ArtistUnicode = artistUnicode;
            if (description != null) music.Description = description;

            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<object> Report(
            [FromForm][Required] long id,
            [FromForm][Required][MaxLength(400)] string reason,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var music = await context.Musics.FindAsync(id);
            if (music is null || music.Deleted || music.Locked) return StatusCode(404);

            var ip = Request.HttpContext.Connection.RemoteIpAddress;

            await context.Reports.AddAsync(new Report()
            {
                From = "ip:" + ip.ToString() + " user:" + (user?.UserName ?? "(anonymous)"),
                Type = "music",
                Target = id.ToString(),
                Reason = reason
            });

            await context.SaveChangesAsync();
            return Ok();
        }

    }
}
