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
    public partial class MapController : ControllerBase
    {

        private readonly UserManager<AppUser> userManager;
        private readonly AppDbContext context;
        private readonly GuidFileProvider fileProvider;
        private readonly MediaFileProcessor mediaProcessor;
        public MapController(
            UserManager<AppUser> userManager, MediaFileProcessor mediaProcessor,
            AppDbContext context, GuidFileProvider fileProvider)
        {
            this.userManager = userManager;
            this.context = context;
            this.fileProvider = fileProvider;
            this.mediaProcessor = mediaProcessor;
        }

        [HttpGet]
        public async Task<object> Info(
            [FromQuery][Required]long id)
        {
            var map = await (
                from m in context.Maps
                where m.Id == id
                join u in context.Users on m.UploaderId equals u.Id
                select new MapInfo(m)
                {
                    uploader = new AppUserInfo(u),
                    plays = (
                        from pl in context.PlayRecords
                        where pl.MapId == m.Id
                        select 1).Count(),
                    favorites = (
                        from fa in context.Favorites
                        where fa.MapId == m.Id
                        select 1).Count(),
                }).FirstOrDefaultAsync();
            if (map is null) return StatusCode(404);
            if (!MapStatus.CanPublicView.Contains(map.status))
            {
                var user = await userManager.GetUserAsync(User);
                if (user is null || user.UserName != map.uploader.username)
                    return StatusCode(403);
            }
            return map;
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Add()
        {
            var user = await userManager.GetUserAsync(User);
            var count = await (
                from m in context.Maps
                where m.UploaderId == user.Id && MapStatus.CanModify.Contains(m.Status)
                select 1).CountAsync();

            if (count >= 3) return StatusCode(403, "To many unreviewed maps.");

            var map = new Map()
            {
                UploaderId = user.Id,
                Status = MapStatus.Wip,
            };
            context.Maps.Add(map);
            await context.SaveChangesAsync();
            return Ok(map.Id);
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Modify(
            [FromForm][Required] long id,
            [FromForm][MaxLength(100)] string musicName,
            [FromForm][MaxLength(100)] string artist,
            [FromForm][MaxLength(100)] string mapName,
            [FromForm][Range(0, 100)] int? difficulty,
            [FromForm][MaxLength(400)] string description,
            [FromForm] string content,
            IFormFile image,
            IFormFile music)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null) return StatusCode(404);
            if (map.UploaderId != user.Id) return StatusCode(403);
            if (!MapStatus.CanModify.Contains(map.Status))
                return StatusCode(403, "Cannot modify reviewed map.");

            if (musicName != null) map.MusicName = musicName;
            else if (artist != null) map.Artist = artist;
            else if (mapName != null) map.MapName = mapName;
            else if (difficulty != null) map.Difficulty = difficulty ?? 20;
            else if (description != null) map.Description = description;
            else if (content != null) map.MapContent = content;
            else if (image != null)
            {
                try
                {
                    var newid = await fileProvider.SaveImageFileWithThumbnail(mediaProcessor, image);
                    if (newid is null) return StatusCode(400, "Image may too big or not valid.");
                    if (!string.IsNullOrEmpty(map.ImageFileId))
                        fileProvider.DeleteImageWithThumbnail(map.ImageFileId);
                    map.ImageFileId = newid;
                }
                catch (Exception)
                {
                    return StatusCode(500);
                }
            }
            else if (music != null)
            {
                try
                {
                    var fileid = await fileProvider.SaveFileAsync(music.OpenReadStream());
                    if (!string.IsNullOrEmpty(map.MusicFileId))
                        fileProvider.DeleteFile(map.MusicFileId);
                    map.MusicFileId = fileid;
                }
                catch (Exception)
                {
                    return StatusCode(500);
                }
            }
            else return StatusCode(400, "No change applied.");

            map.LastModified = DateTimeOffset.Now;
            map.Status = MapStatus.Wip;

            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Delete(
            [FromForm][Required] long id)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null) return StatusCode(404);
            if (map.UploaderId != user.Id &&
                !await userManager.IsInRoleAsync(user, AppUserRole.Admin)) return StatusCode(403);

            if (map.ImageFileId != null) fileProvider.DeleteImageWithThumbnail(map.ImageFileId);
            if (map.MusicFileId != null) fileProvider.DeleteFile(map.MusicFileId);

            context.Maps.Remove(map);
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
