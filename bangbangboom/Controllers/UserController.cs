using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers
{

    [Route("api/[controller]/[action]")]
    [ApiController]
    public partial class UserController : ControllerBase
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
            return new
            {
                username = user.UserName,
                nickname = user.NickName,
                whatsup = user.WhatsUp,
                hasprofile = user.ProfileFileHash != null,
                roles = await userManager.GetRolesAsync(user),
            };
        }

        [HttpGet]
        public async Task<object> Info(
            [FromForm][Required]string username,
            [FromServices] AppDbContext context)
        {
            var userq =
                from u in context.Users
                where u.NormalizedUserName == userManager.NormalizeKey(username)
                select new AppUserInfo(u)
                {
                    uploadedmaps = (
                        from m in context.Maps
                        where m.UploaderId == u.Id
                        select 1).Count()
                };
            var user = await userq.FirstOrDefaultAsync();
            if (user == null) return StatusCode(404);
            return user;
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

        [HttpGet("{username}.{ext?}")]
        public async Task<object> Profile(
            [Required]string username,
            [FromServices] HashFileProvider fileProvider)
        {
            var user = await userManager.FindByNameAsync(username);
            var hash = user?.ProfileFileHash;
            if (hash == null)
                return StatusCode(404);
            try
            {
                var fs = fileProvider.GetFileByHash(hash);
                return File(fs, "image/jpeg", null,
                    EntityTagHeaderValue.Parse(new StringSegment('"' + hash + '"')), true);
            }
            catch (FileNotFoundException)
            {
                return StatusCode(404);
            }
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
            if (user.ProfileFileHash != null)
                fileProvider.DeleteFile(user.ProfileFileHash);
            user.ProfileFileHash = hash;
            await context.SaveChangesAsync();
            return Ok();
        }


    }
}
