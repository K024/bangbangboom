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
    public class FavoriteController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        public FavoriteController(
            UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> All(
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var favoritesq =
                from f in context.Favorites
                where f.UserId == user.Id
                join m in context.Maps on f.MapId equals m.Id
                orderby f.DateTime descending
                select new MapInfo(m)
                {
                    uploader = new AppUserInfo(user),
                    plays = (
                        from pl in context.PlayRecords
                        where pl.MapId == m.Id
                        select 1).Count(),
                    favorites = (
                        from fa in context.Favorites
                        where fa.MapId == m.Id
                        select 1).Count(),
                };
            return await favoritesq.ToListAsync();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Add(
            [FromForm][Required] long MapId,
            [FromServices] AppDbContext context)
        {
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
            [FromForm][Required] long MapId,
            [FromServices] AppDbContext context)
        {
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
    }
}
