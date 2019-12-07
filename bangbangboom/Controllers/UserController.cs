using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers {

    [Route("api/[controller]/[action]")]
    [ApiController]
    public partial class UserController : ControllerBase {
        private readonly UserManager<AppUser> userManager;
        private readonly AppDbContext context;
        private readonly GuidFileProvider fileProvider;
        public UserController(
            UserManager<AppUser> userManager, AppDbContext context, GuidFileProvider provider) {
            this.userManager = userManager;
            this.context = context;
            fileProvider = provider;
        }

        [HttpGet]
        public async Task<object> Me() {
            var user = await userManager.GetUserAsync(User);

            if (user is null) return StatusCode(204);

            return new AppUserInfo(user) {
                roles = (await userManager.GetRolesAsync(user)).ToArray(),
            };
        }

        [HttpGet]
        public async Task<object> Info(
            [FromForm][Required]string username) {
            var res = await (
                from u in context.Users
                where u.NormalizedUserName == userManager.NormalizeName(username)
                select new {
                    user = u,
                    uploadedmaps = (
                        from m in context.Maps
                        where m.UploaderId == u.Id
                        select 1).Count()
                }).FirstOrDefaultAsync();
            if (res == null) return StatusCode(404);
            var user = new AppUserInfo(res.user) {
                uploadedmaps = res.uploadedmaps
            };
            return user;
        }

        [Authorize]
        [HttpPost]
        public async Task<object> SetNickName(
            [FromForm][MaxLength(20)] string nickname) {
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
            [FromForm][MaxLength(300)] string whatsup) {
            var user = await userManager.GetUserAsync(User);
            user.WhatsUp = whatsup;
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("{username}.{ext?}")]
        public async Task<object> Profile(
            [Required]string username,
            [FromQuery]string min) {
            var user = await userManager.FindByNameAsync(username);
            var fileid = user?.ProfileFileId;
            if (fileid == null)
                return StatusCode(404);
            try {
                var fs = fileProvider.GetImageWithThumbnail(fileid, out var etag, min != null);
                return File(fs, "image/jpeg", DateTimeOffset.MinValue,
                    EntityTagHeaderValue.Parse(new StringSegment('"' + etag + '"')), true);
            } catch (FileNotFoundException) {
                return StatusCode(404);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<object> UploadProfile(
            IFormFile file,
            [FromServices] MediaFileProcessor processor) {
            var user = await userManager.GetUserAsync(User);
            if (file != null) {
                var newid = await fileProvider.SaveImageFileWithThumbnail(processor, file);
                if (newid is null) return StatusCode(400, "Image may too big or not valid.");
                if (user.ProfileFileId != null)
                    fileProvider.DeleteImageWithThumbnail(user.ProfileFileId);
                user.ProfileFileId = newid;
            } else {
                if (user.ProfileFileId != null)
                    fileProvider.DeleteImageWithThumbnail(user.ProfileFileId);
                user.ProfileFileId = null;
            }
            await context.SaveChangesAsync();
            return Ok();
        }


    }
}
