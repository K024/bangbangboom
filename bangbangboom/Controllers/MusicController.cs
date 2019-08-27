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
    public class MusicController : ControllerBase
    {

        private readonly UserManager<AppUser> _userManager;
        public MusicController(
            UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }


        /// <summary>
        /// 专门为制谱人检查是否自己想要上传的歌曲已经被上传了；歌曲搜索框
        /// </summary>
        /// <param name="key">搜索的内容，包括歌曲名字，歌手，歌曲简介</param>
        /// <param name="_context"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet("[action]")]
        public async Task<object> Search(
            [FromQuery]string key,
            [FromServices] AppDbContext _context)
        {
            var musics = await
                (from m in _context.Musics
                 where (m.Artist.Contains(key) || m.ArtistUnicode.Contains(key)
                 || m.Title.Contains(key) || m.TitleUnicode.Contains(key)
                 || m.Description.Contains(key)) && !m.Deleted
                 select new
                 {
                     m.Id,
                     m.Title,
                     m.TitleUnicode,
                     m.Artist,
                     m.ArtistUnicode,
                     m.Description,
                     m.Locked
                 }).ToListAsync();
            return musics;
        }


        /// <summary>
        /// 用于下载歌曲，
        /// 适用于 游玩场景 ， 制谱人检查是否想要的歌曲已经上传的 场景
        /// </summary>
        /// <param name="musicId">搜索后有服务器提供的 音乐id</param>
        /// <param name="fileProvider"></param>
        /// <param name="_context"></param>
        /// <returns></returns>
        [Authorize]
        [HttpGet("[action]/{musicId}")]
        public async Task<object> File(
            [Required]int musicId,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext _context)
        {
            var music = await _context.Musics.Where(x => x.Id == musicId && !x.Deleted).FirstAsync();
            if (music is null)
                return StatusCode(404);
            if (music.Locked)
                return StatusCode(403);
            var fs = fileProvider.GetFileByHash(music.FileHash);
            return File(fs, "audio/mp3", null,
                EntityTagHeaderValue.Parse(new StringSegment('"' + music.FileHash + '"')), true);
        }


        /// <summary>
        /// 用于用户上传歌曲，
        /// 在谱面制作场景中用到
        /// 不对歌曲本身的大小等参数做限制，没有提供unicode的转换
        /// </summary>
        /// <param name="file">音乐文件本身</param>
        /// <param name="uploaderid"></param>
        /// <param name="title"></param>
        /// <param name="artist"></param>
        /// <param name="description"></param>
        /// <param name="fileProvider"></param>
        /// <param name="_context"></param>
        /// <returns></returns>
        [Authorize]
        [HttpPost("[action]")]
        public async Task<object> upLoadMusic(
            [Required]IFormFile file,
            [Required][MaxLength(100)]string title,
            [Required][MaxLength(100)]string artist,
            [Required][MaxLength(100)]string titleUnicode,
            [Required][MaxLength(100)]string artistUnicode,
            [Required][MaxLength(400)]string description,
            [FromServices] HashFileProvider fileProvider,
            [FromServices] AppDbContext _context)
        {
            var user = await _userManager.GetUserAsync(User);
            if (file.ContentType != "audio/mp3" ||
                file.Length > 1024 * 1024 * 5 ||
                title.Any(c => c > 127) ||
                artist.Any(c => c > 127))
                return StatusCode(400);

            var loadedMusic = new Music
            {
                Uploader = user,
                Title = title,
                TitleUnicode = titleUnicode,
                Artist = artist,
                ArtistUnicode = artistUnicode,
                Description = description,
                FileHash = await fileProvider.SaveFileAsync(file.OpenReadStream())
            };
            _context.Musics.Add(loadedMusic);
            await _context.SaveChangesAsync();
            return Ok();
        }
        
    }
}
