using bangbangboom.Data;
using bangbangboom.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers {

    public partial class MapController : ControllerBase {
        [HttpGet]
        public async Task<object> Search(
            [FromQuery][Required][MaxLength(50)] string key,
            [FromQuery]DateTimeOffset? end) {

            if (string.IsNullOrEmpty(key)) return StatusCode(401);
            var time = end ?? DateTimeOffset.Now;
            var res = await (
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where (m.MusicName.Contains(key) || m.Artist.Contains(key)
               || m.MapName.Contains(key)|| m.Description.Contains(key))
               && m.Reviewed < time
               && MapStatus.CanList.Contains(m.Status)
               orderby m.Reviewed descending
               select new {
                   map = m,
                   uploader = u,
                   plays = (
                       from pl in context.PlayRecords
                       where pl.MapId == m.Id
                       select 1).Count(),
                   favorites = (
                       from fa in context.Favorites
                       where fa.MapId == m.Id
                       select 1).Count(),
               }).Take(24).ToListAsync();

            var maps = res.Select(r => new MapInfo(r.map) {
                uploader = new AppUserInfo(r.uploader),
                plays = r.plays,
                favorites = r.favorites
            });

            return maps;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> MyMaps() {
            var user = await userManager.GetUserAsync(User);
            var res = await (
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where u.Id == user.Id
               orderby m.Reviewed descending
               select new {
                   map = m,
                   uploader = u,
                   plays = (
                       from pl in context.PlayRecords
                       where pl.MapId == m.Id
                       select 1).Count(),
                   favorites = (
                       from fa in context.Favorites
                       where fa.MapId == m.Id
                       select 1).Count(),
               }).Take(24).ToListAsync();

            var maps = res.Select(r => new MapInfo(r.map) {
                uploader = new AppUserInfo(r.uploader),
                plays = r.plays,
                favorites = r.favorites
            });

            return maps;
        }

        [HttpGet]
        public async Task<object> Latest(
            [FromQuery] DateTimeOffset? end) {
            var time = end ?? DateTimeOffset.Now;
            var res = await (
               from m in context.Maps
               where MapStatus.CanList.Contains(m.Status) && m.Reviewed < time
               join u in context.Users on m.UploaderId equals u.Id
               orderby m.Reviewed descending
               select new {
                   map = m,
                   uploader = u,
                   plays = (
                       from pl in context.PlayRecords
                       where pl.MapId == m.Id
                       select 1).Count(),
                   favorites = (
                       from fa in context.Favorites
                       where fa.MapId == m.Id
                       select 1).Count(),
               }).Take(24).ToListAsync();

            var maps = res.Select(r => new MapInfo(r.map) {
                uploader = new AppUserInfo(r.uploader),
                plays = r.plays,
                favorites = r.favorites
            });

            return maps;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> Reviewings(
            [FromQuery]DateTimeOffset? end) {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Reviewer))
                return StatusCode(403);
            var time = end ?? DateTimeOffset.Now;
            var res = await (
               from m in context.Maps
               join u in context.Users on m.UploaderId equals u.Id
               where m.Status == MapStatus.Reviewing && m.LastModified < time
               orderby m.LastModified descending
               select new {
                   map = m,
                   uploader = u,
               }).Take(24).ToListAsync();

            var maps = res.Select(r => new MapInfo(r.map) {
                uploader = new AppUserInfo(r.uploader),
            });

            return maps;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> All(
            [FromQuery] long? end) {
            var user = await userManager.GetUserAsync(User);
            if (!await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);
            var id = end ?? long.MaxValue;
            var res = await (
                from m in context.Maps
                join u in context.Users on m.UploaderId equals u.Id
                where m.Id < id
                orderby m.Id descending
                select new {
                    map = m,
                    uploader = u,
                }).Take(24).ToListAsync();

            var maps = res.Select(r => new MapInfo(r.map) {
                uploader = new AppUserInfo(r.uploader),
            });

            return maps;
        }
    }
}
