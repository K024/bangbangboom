using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers
{

    public partial class MapController : ControllerBase
    {

        [Authorize]
        [HttpPost]
        public async Task<object> Publish(
            [FromForm][Required]long id)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null) return StatusCode(404);
            if (map.Status != MapStatus.Wip || user.Id != map.UploaderId)
                return StatusCode(403);
            map.Status = MapStatus.Reviewing;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Review(
            [FromForm][Required] long id,
            [FromForm] bool? pass,
            [FromForm] bool? proved)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null) return StatusCode(404);
            if (map.Status != MapStatus.Reviewing) return StatusCode(403);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Reviewer)) return StatusCode(403);

            if (pass ?? false)
            {
                map.Status = proved ?? false ? MapStatus.Proved : MapStatus.Reviewed;
                map.Reviewed = DateTimeOffset.Now;
            }
            else
            {
                map.Status = MapStatus.NotPass;
                map.Reviewed = null;
            }
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Recall(
            [FromForm][Required]long id)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(id);
            if (map is null) return StatusCode(404);
            if (!MapStatus.CanPublicView.Contains(map.Status) || user.Id != map.UploaderId
                || !await userManager.IsInRoleAsync(user, AppUserRole.Reviewer))
                return StatusCode(403);
            map.Status = MapStatus.Wip;
            map.Reviewed = null;
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
