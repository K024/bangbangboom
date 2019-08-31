using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;

namespace bangbangboom.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        public UserController(
            UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> Me()
        {
            var user = await userManager.GetUserAsync(User);
            return AppUserDetailed.FromAppUser(user);
        }

        [HttpGet("{username}")]
        public async Task<object> Info(
            [Required]string username)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user is null) return StatusCode(404);
            return AppUserDetailed.FromAppUser(user);
        }

        [Authorize]
        [HttpPost]
        public async Task<object> SetNickName(
            [FromForm][MaxLength(20)] string nickname,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            nickname = nickname?.Trim();
            if (string.IsNullOrWhiteSpace(nickname))
                nickname = null;
            user.NickName = nickname;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> SetWhatsUp(
            [FromForm][MaxLength(300)] string whatsup,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            user.WhatsUp = whatsup;
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("{username}")]
        public async Task<object> Profile(
            [Required]string username,
            [FromServices] HashFileProvider fileProvider)
        {
            var user = await userManager.FindByNameAsync(username);
            var hash = user?.ProfileFileHash;
            if (hash == null)
                return StatusCode(404);
            var fs = fileProvider.GetFileByHash(hash);
            return File(fs, "image/jpeg", null,
                EntityTagHeaderValue.Parse(new StringSegment('"' + hash + '"')), true);
        }

        [Authorize]
        [HttpPost]
        public async Task<object> UploadProfile(
            [Required] IFormFile file,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext context,
            [FromServices] MediaFileProcessor processor)
        {
            if (!processor.TryProcessImage(file.OpenReadStream(), out var jpg,
                maxsize: 200 * 1024))
                return StatusCode(400);
            var user = await userManager.GetUserAsync(User);
            var hash = await fileProvider.SaveFileAsync(jpg);
            fileProvider.DeleteFile(user.ProfileFileHash);
            user.ProfileFileHash = hash;
            await context.SaveChangesAsync();
            return Ok();
        }


        [Authorize]
        [HttpPost]
        public async Task<object> AddFavorite(
            [FromForm][Required] long mapId,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(mapId);
            if (map is null || map.Deleted) return StatusCode(404);

            if (user.Favorites.Select(f => f.Map == map).Count() <= 0)
            {
                user.Favorites.Add(new Favorite() { Map = map });
                await context.SaveChangesAsync();
            }

            return Ok();
        }


        [Authorize]
        [HttpPost]
        public async Task<object> RemoveFavorite(
            [FromForm][Required] long mapId,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var favorite = context.Favorites.Where(f => f.MapId == mapId).FirstOrDefault();

            if (favorite != null)
            {
                user.Favorites.Remove(favorite);
                await context.SaveChangesAsync();
            }

            return Ok();
        }


        [Authorize]
        [HttpGet]
        public async Task<object> Favorites()
        {
            var user = await userManager.GetUserAsync(User);

            var favorites =
                from f in user.Favorites
                where !f.Map.Deleted
                orderby f.DateTime descending
                select MapShort.FormMap(f.Map);

            return favorites;
        }

    }
}
