using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using bangbangboom.Services;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using System.IO;
using Microsoft.AspNetCore.Identity;

namespace bangbangboom.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {

        private readonly UserManager<AppUser> _userManager;
        public MapController(
            UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }


        /// <summary>
        /// 给普通玩家提供的搜索框，
        /// 可以查找歌曲名，歌手，谱面名，谱面上传者，音乐描述,谱面描述
        /// 相当于查找谱面
        /// </summary>
        /// <param name="key">用户输入的搜索值</param>
        /// <param name="_context"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet("[action]")]
        public async Task<object> Search(
            [FromQuery]string key,
            [FromServices] AppDbContext _context)
        {
            var maps = await
               (from m in _context.Maps
                where (m.Music.Title.Contains(key) || m.Music.TitleUnicode.Contains(key)
                || m.Music.Artist.Contains(key) || m.Music.ArtistUnicode.Contains(key)
                || m.MapName.Contains(key) || m.Uploader.NickName.Contains(key)
                || m.Music.Description.Contains(key) || m.Description.Contains(key)) && !m.Deleted
                select new
                {
                    m.Id,
                    m.MapName,
                    m.Uploader.NickName,
                    m.Description,
                    m.Difficulty,
                    m.Rates,
                    m.Music.Title,
                    m.Music.TitleUnicode,
                    m.Music.Artist,
                    m.Music.ArtistUnicode,
                    m.Music.Locked
                }).ToListAsync();
            return maps;
                
        }


        /// <summary>
        /// 用于游玩时，下载谱面
        /// </summary>
        /// <param name="musicId"></param>
        /// <param name="fileProvider"></param>
        /// <param name="_context"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet("[action]/{mapId}")]
        public async Task<object> File(
            [Required]int mapId,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext _context)
        {
            var map = await _context.Maps.Where(x => x.Id == mapId).FirstAsync();
            if (map != null)
                return map.MapContent;
            else
                return StatusCode(404);
        }


        [Authorize]
        [HttpPost("[action]")]
        public async Task<object> Upload(
            [Required]int musicId,
            [Required][MaxLength(100)]string mapname,
            [Required]int diff,
            [MaxLength(400)]string description,
            [Required]string content,
            [Required]IFormFile imgfile,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext _context,
            [FromServices] MediaFileProcessor processor)
        {
            var user = await _userManager.GetUserAsync(User);
            var music = await _context.Musics.Where(x => x.Id == musicId && !x.Deleted).FirstAsync();
            if (music is null)
                return StatusCode(403);
            if (music.Locked)
                return StatusCode(403);

            var loadedMap = new Map();
            loadedMap.Uploader = user;
            loadedMap.Music = music;
            loadedMap.MapName = mapname;
        
            if (diff > 50)
                return StatusCode(400);
            loadedMap.Difficulty = diff;
            loadedMap.Description = description;
            loadedMap.MapContent = content;
            if (!processor.TryProcessImage(imgfile.OpenReadStream(), out var jpg,
                maxsize: 200 * 1024))
                return StatusCode(400);
            var hash = await fileProvider.SaveFileAsync(jpg);
            loadedMap.ImageFileHash = hash;
            return Ok();
        }
    }
}
