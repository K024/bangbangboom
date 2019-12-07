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
    public class FavoriteController : ControllerBase {
        private readonly UserManager<AppUser> userManager;
        private readonly AppDbContext context;
        public FavoriteController(
            UserManager<AppUser> userManager, AppDbContext context) {
            this.userManager = userManager;
            this.context = context;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> All(
            [FromQuery] DateTimeOffset? end) {
            var time = end ?? DateTimeOffset.Now;
            var user = await userManager.GetUserAsync(User);
            var res = await (
                from f in context.Favorites
                where f.UserId == user.Id && f.DateTime < time
                join m in context.Maps on f.MapId equals m.Id
                join u in context.Users on m.UploaderId equals u.Id
                orderby f.DateTime descending
                select new {
                    map = m,
                    uploader = u,
                    time = f.DateTime,
                    plays = (
                        from pl in context.PlayRecords
                        where pl.MapId == m.Id
                        select 1).Count(),
                    favorites = (
                        from fa in context.Favorites
                        where fa.MapId == m.Id
                        select 1).Count(),
                }).Take(24).ToListAsync();
            return new {
                data = res.Select(r => new MapInfo(r.map) {
                    uploader = new AppUserInfo(r.uploader),
                    plays = r.plays,
                    favorites = r.favorites
                }),
                end = res.LastOrDefault()?.time
            };
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Add(
            [FromForm][Required] long MapId) {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(MapId);
            if (map is null) return StatusCode(404);

            context.Favorites.Add(new Favorite { MapId = map.Id, UserId = user.Id });
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Remove(
            [FromForm][Required] long MapId) {
            var user = await userManager.GetUserAsync(User);
            var favorite = await (
                from f in context.Favorites
                where user.Id == f.UserId && MapId == f.MapId
                select f).FirstOrDefaultAsync();

            if (favorite is null) return StatusCode(404);
            context.Favorites.Remove(favorite);
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpGet]
        public async Task<object> IsFavorite(
            [FromQuery][Required] long MapId) {
            var user = await userManager.GetUserAsync(User);
            var favorite = await (
                from f in context.Favorites
                where user.Id == f.UserId && MapId == f.MapId
                select f).FirstOrDefaultAsync();
            if (favorite is null) return false;
            return true;
        }
    }
}
