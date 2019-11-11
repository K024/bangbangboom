using bangbangboom.Data;
using bangbangboom.Services;
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

        [HttpGet("{id}.{ext?}")]
        public async Task<object> Content(
            [Required]long id)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null) return StatusCode(404);

            if (!MapStatus.CanPublicView.Contains(map.Status))
            {
                var user = await userManager.GetUserAsync(User);
                if (user is null || user.Id != map.UploaderId)
                    return StatusCode(403);
            }

            return Ok(map.MapContent);
        }

        [HttpGet("{id}.{ext?}")]
        public async Task<object> Image(
            [Required]long id)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.ImageFileIdAndType is null) return StatusCode(404);
            if (!MapStatus.CanPublicView.Contains(map.Status))
            {
                var user = await userManager.GetUserAsync(User);
                if (user is null || user.Id != map.UploaderId)
                    return StatusCode(403);
            }
            try
            {
                var idAndType = map.ImageFileIdAndType.Split(':');
                var file = fileProvider.GetFileByGuid(idAndType[0]);

                return File(file, idAndType[1], null,
                    EntityTagHeaderValue.Parse(new StringSegment('"' + idAndType[0] + '"')), true);
            }
            catch (Exception)
            {
                return StatusCode(404, "File not found.");
            }
        }
        [HttpGet("{id}.{ext?}")]
        public async Task<object> Music(
            [Required] long id)
        {
            var map = await context.Maps.FindAsync(id);
            if (map is null || map.MusicFileId is null) return StatusCode(404);
            if (!MapStatus.CanPublicView.Contains(map.Status))
            {
                var user = await userManager.GetUserAsync(User);
                if (user is null || user.Id != map.UploaderId)
                    return StatusCode(403);
            }
            try
            {
                var file = fileProvider.GetFileByGuid(map.MusicFileId);
                return File(file, "audio/mp3", null,
                    EntityTagHeaderValue.Parse(new StringSegment('"' + map.MusicFileId + '"')), true);
            }
            catch (Exception)
            {
                return StatusCode(404, "File not found.");
            }
        }
    }
}
