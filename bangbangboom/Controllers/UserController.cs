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
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        public UserController(
            UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> Get()
        {
            var user = await _userManager.GetUserAsync(User);
            return new
            {
                username = user.UserName,
                nickname = user.NickName ?? "",
                whatsup = user.WhatsUp ?? "",
            };
        }

        [HttpGet("{username}")]
        public async Task<object> GetUser(
            [Required]string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user is null) return StatusCode(404);
            return new
            {
                username,
                nickname = user.NickName ?? "",
                whatsup = user.WhatsUp ?? "",
            };
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<object> SetNickName(
            [FromForm][MaxLength(20)] string nickname,
            [FromServices] AppDbContext context)
        {
            var user = await _userManager.GetUserAsync(User);
            nickname = nickname?.Trim();
            if (string.IsNullOrWhiteSpace(nickname))
                nickname = null;
            user.NickName = nickname;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<object> SetWhatsUp(
            [FromForm][MaxLength(300)] string whatsup,
            [FromServices] AppDbContext context)
        {
            var user = await _userManager.GetUserAsync(User);
            user.WhatsUp = whatsup;
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("[action]/{username}")]
        public async Task<object> Profile(
            [Required]string username,
            [FromServices] HashFileProvider fileProvider)
        {
            var user = await _userManager.FindByNameAsync(username);
            var hash = user?.ProfileFileHash;
            if (hash == null)
                return StatusCode(404);
            var fs = fileProvider.GetFileByHash(hash);
            return File(fs, "image/jpeg", null,
                EntityTagHeaderValue.Parse(new StringSegment('"' + hash + '"')), true);
        }

        [Authorize]
        [HttpPost("[action]")]
        public async Task<object> UploadProfile(
            [Required]IFormFile file,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext context,
            [FromServices] MediaFileProcessor processor)
        {
            if (!processor.TryProcessImage(file.OpenReadStream(), out var jpg,
                maxsize: 200 * 1024))
                return StatusCode(400);
            var user = await _userManager.GetUserAsync(User);
            var hash = await fileProvider.SaveFileAsync(jpg);
            fileProvider.DeleteFile(user.ProfileFileHash);
            user.ProfileFileHash = hash;
            await context.SaveChangesAsync();
            return Ok();
        }

    }
}
