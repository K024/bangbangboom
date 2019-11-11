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
        [HttpGet]
        public object Search(
            [FromQuery][Required][MaxLength(50)] string key,
            [FromQuery][Range(1, 10000)] int? page)
        {
            if (string.IsNullOrEmpty(key)) return StatusCode(401);
            var maps =
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where (m.MusicName.Contains(key) || m.Artist.Contains(key)
               || m.MapName.Contains(key) || u.UserName.Contains(key)
               || u.NickName.Contains(key) || m.Description.Contains(key))
               && MapStatus.CanList.Contains(m.Status)
               orderby m.Reviewed descending
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
               };

            return maps.Page(page ?? 1);
        }

        [Authorize]
        [HttpGet]
        public async Task<object> MyMaps()
        {
            var user = await userManager.GetUserAsync(User);
            var maps =
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where u.Id == user.Id
               orderby m.Reviewed descending
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
               };
            return maps;
        }

        [HttpGet]
        public object Latest(
            [FromQuery][Range(1, 10000)] int? page)
        {
            var maps =
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where MapStatus.CanList.Contains(m.Status)
               orderby m.Reviewed descending
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
               };
            return maps.Page(page ?? 1);
        }

        [Authorize]
        [HttpGet]
        public async Task<object> Reviewings(
            [FromQuery][Range(1, 10000)] int? page)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Reviewer))
                return StatusCode(403);
            var maps =
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where m.Status == MapStatus.Reviewing
               orderby m.LastModified descending
               select new MapInfo(m)
               {
                   uploader = new AppUserInfo(u),
               };
            return maps.Page(page ?? 1);
        }

        [Authorize]
        [HttpGet]
        public async Task<object> All(
            [FromQuery][Range(1, 10000)] int? page)
        {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var maps =
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               orderby m.Created descending
               select new MapInfo(m)
               {
                   uploader = new AppUserInfo(u),
               };
            return maps.Page(page ?? 1);
        }
    }
}
