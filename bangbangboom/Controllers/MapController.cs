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
    public class MapController : ControllerBase
    {

        private readonly UserManager<AppUser> userManager;
        public MapController(
            UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<object> Info(
            [FromQuery][Required]long id,
            [FromServices] AppDbContext context)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted) return StatusCode(404);
            return MapDetailed.FormMap(map);
        }

        [HttpGet]
        public object Search(
            [FromQuery][Required][MaxLength(50)] string key,
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var maps =
               from m in context.Maps
               where (m.Music.Title.Contains(key) || m.Music.TitleUnicode.Contains(key)
               || m.Music.Artist.Contains(key) || m.Music.ArtistUnicode.Contains(key)
               || m.MapName.Contains(key) || m.Uploader.UserName.Contains(key) || m.Uploader.NickName.Contains(key)
               || m.Music.Description.Contains(key) || m.Description.Contains(key)) && !m.Deleted
               select MapShort.FormMap(m);
            var p = page ?? 1 - 1;

            return maps.Skip(p * 48).Take(48);
        }

        [HttpGet]
        public object Latest(
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var maps =
                from m in context.Maps
                where !m.Deleted
                orderby m.Date descending
                select MapShort.FormMap(m);
            var p = page ?? 1 - 1;
            return maps.Skip(p * 48).Take(48);
        }


        [HttpGet]
        public object LatestProved(
            [FromQuery][Range(1, 10000)] int? page,
            [FromServices] AppDbContext context)
        {
            var maps =
                from m in context.Maps
                where !m.Deleted && m.Proved
                orderby m.Date descending
                select MapShort.FormMap(m);
            var p = page ?? 1 - 1;
            return maps.Skip(p * 48).Take(48);
        }

        [HttpGet("{id}")]
        public async Task<object> Content(
            [Required]int id,
            [FromServices] AppDbContext context)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted) return StatusCode(404);
            if (map.Locked) return StatusCode(403);

            var user = await userManager.GetUserAsync(User);
            if (user != null)
            {
                await context.PlayRecords.AddAsync(new PlayRecord() { Map = map, User = user });
                await context.SaveChangesAsync();
            }

            return Ok(map.MapContent);
        }

        [HttpGet("{id}")]
        public async Task<object> Image(
            [Required]int id,
            [FromServices] AppDbContext context,
            [FromServices] HashFileProvider fileProvider)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted) return StatusCode(404);
            if (map.Locked) return StatusCode(403);

            var hashAndType = map.ImageFileHashAndType.Split(':');
            var file = fileProvider.GetFileByHash(hashAndType[0]);

            return File(file, hashAndType[1], null,
                EntityTagHeaderValue.Parse(new StringSegment('"' + hashAndType[0] + '"')), true);
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Upload(
            [FromForm][Required] int musicId,
            [FromForm][Required][MaxLength(100)] string mapName,
            [FromForm][Required][Range(0, 100)] int difficulty,
            [FromForm][Required][MaxLength(400)] string description,
            [FromForm][Required] string content,
            [FromForm][Required] IFormFile image,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var music = await context.Musics.FindAsync(musicId);
            if (music is null || music.Deleted) return StatusCode(404);

            var type = image.ContentType;
            if (!type.StartsWith("image") || image.Length > 1024 * 1024 * 5) return StatusCode(400);
            var hash = await fileProvider.SaveFileAsync(image.OpenReadStream());

            var map = new Map()
            {
                Uploader = user,
                Music = music,
                MapName = mapName,
                Difficulty = difficulty,
                Description = description,
                MapContent = content,
                ImageFileHashAndType = hash + ":" + type
            };
            await context.Maps.AddAsync(map);
            await context.SaveChangesAsync();
            return Ok(map.Id);
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Modify(
            [FromForm] int id,
            [FromForm] int? musicId,
            [FromForm][MaxLength(100)] string mapName,
            [FromForm][Range(0, 100)] int? difficulty,
            [FromForm][MaxLength(400)] string description,
            [FromForm] string content,
            [FromForm] IFormFile image,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted) return StatusCode(404);
            if (map.Uploader != user) return StatusCode(403);

            if (musicId != null)
            {
                var music = await context.Musics.FindAsync(musicId);
                if (music is null || music.Deleted) return StatusCode(404);
                map.Music = music;
            }
            if (mapName != null) map.MapName = mapName;
            if (difficulty != null) map.Difficulty = difficulty ?? 20;
            if (description != null) map.Description = description;
            if (content != null) map.MapContent = content;
            if (image != null)
            {
                var type = image.ContentType;
                if (!type.StartsWith("image") || image.Length > 1024 * 1024 * 5) return StatusCode(400);
                var hash = await fileProvider.SaveFileAsync(image.OpenReadStream());
                fileProvider.DeleteFile(map.ImageFileHashAndType.Split(':')[0]);
                map.ImageFileHashAndType = hash + ":" + type;
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Rate(
            [FromForm][Required] long id,
            [FromForm][Required][Range(1, 5)] int score,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted || map.Locked) return StatusCode(404);

            var rate = context.Rates.Where(r => r.User == user && r.Map == map).FirstOrDefault();

            if (rate is null)
            {
                await context.Rates.AddAsync(new Rate() { Map = map, User = user, RateScore = score });
            }
            else
            {
                rate.RateScore = score;
            }
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> CancelRate(
            [FromForm][Required] long id,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);

            var rate = context.Rates.Where(r => r.User == user && r.MapId == id).FirstOrDefault();

            if (rate is null) return StatusCode(404);

            context.Rates.Remove(rate);

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
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.Deleted || map.Locked) return StatusCode(404);

            var ip = Request.HttpContext.Connection.RemoteIpAddress;

            await context.Reports.AddAsync(new Report()
            {
                From = "ip:" + ip.ToString() + " user:" + (user?.UserName ?? "(anonymous)"),
                Type = "map",
                Target = id.ToString(),
                Reason = reason
            });

            await context.SaveChangesAsync();
            return Ok();
        }

    }
}
