using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CommentController : ControllerBase
    {

        private readonly UserManager<AppUser> userManager;
        public CommentController(
            UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        public object Info(
            [FromQuery][Required] long id,
            [FromServices] AppDbContext context)
        {
            var comment = context.Comments
                .Include(c => c.User).Include(c => c.LikeDislikes)
                .Where(c => c.Id == id).FirstOrDefault();
            if (comment is null) return StatusCode(404);

            return CommentDetail.FromComment(comment);
        }

        [HttpGet]
        public async Task<object> Map(
            [FromQuery][Required] long MapId,
            [FromServices] AppDbContext context)
        {
            var map = await context.Maps.FindAsync(MapId);
            if (map is null || map.Deleted) return StatusCode(404);

            return map.Comments.AsQueryable()
                .Include(c => c.User).Include(c => c.LikeDislikes)
                .Select(c => CommentDetail.FromComment(c, false));
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Send(
            [FromForm][Required] long MapId,
            [FromForm] long? ReplyId,
            [FromForm][Required][MaxLength(200)] string comment,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(MapId);
            if (map is null || map.Deleted) return StatusCode(404);
            if (map.Locked) return StatusCode(403);
            Comment parent = null;
            if (ReplyId != null)
                parent = await context.Comments.FindAsync(ReplyId);

            map.Comments.Add(new Comment()
            {
                User = user,
                ParentComment = parent,
                Content = comment
            });
            await context.SaveChangesAsync();
            return Ok();
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Delete(
            [FromForm][Required] long id,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var comment = await context.Comments.FindAsync(id);
            if (comment is null) return StatusCode(404);
            if (comment.User != user) return StatusCode(403);

            comment.Locked = true;
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Like(
            [FromForm][Required] long id,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var comment = await context.Comments.FindAsync(id);
            if (comment is null || comment.Locked) return StatusCode(404);

            var ld = context.LikeDislikes.Where(l => l.User == user && l.Comment == comment).FirstOrDefault();
            if (ld is null)
            {
                await context.LikeDislikes.AddAsync(new LikeDislike() { Comment = comment, User = user });
            }
            else
            {
                ld.IsDislike = false;
            }
            await context.SaveChangesAsync();
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> DisLike(
            [FromForm][Required] long id,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var comment = await context.Comments.FindAsync(id);
            if (comment is null || comment.Locked) return StatusCode(404);

            var ld = context.LikeDislikes.Where(l => l.User == user && l.Comment == comment).FirstOrDefault();
            if (ld is null)
            {
                await context.LikeDislikes.AddAsync(new LikeDislike() { Comment = comment, User = user, IsDislike = true });
            }
            else
            {
                ld.IsDislike = true;
            }
            await context.SaveChangesAsync();
            return Ok();
        }

        public class MyLikeDislikeInfo
        {
            public long id;
            public bool isdislike = false;
        }

        [Authorize]
        [HttpGet]
        public async Task<object> MyLikeDislikes(
            [FromQuery][Required] long MapId,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var lds =
                from l in context.LikeDislikes.Include(l => l.Comment)
                where l.User == user && l.Comment.MapId == MapId
                select new MyLikeDislikeInfo() { id = l.CommentId, isdislike = l.IsDislike };

            return lds;
        }

        [Authorize]
        [HttpPost]
        public async Task<object> CancelLike(
            [FromForm][Required] long id,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);

            var ld = context.LikeDislikes.Where(l => l.User == user && l.CommentId == id).FirstOrDefault();
            if (ld is null) return StatusCode(404);

            context.LikeDislikes.Remove(ld);
            await context.SaveChangesAsync();

            return Ok();
        }

        [HttpPost]
        public async Task<object> Report(
            [FromForm][Required] long id,
            [FromForm][Required][MaxLength(400)] string reason,
            [FromServices] AppDbContext context)
        {
            var user = await userManager.GetUserAsync(User);
            var comment = await context.Comments.FindAsync(id);
            if (comment is null || comment.Locked) return StatusCode(404);

            var ip = Request.HttpContext.Connection.RemoteIpAddress;

            await context.Reports.AddAsync(new Report()
            {
                From = "ip:" + ip.ToString() + " user:" + (user?.UserName ?? "(anonymous)"),
                Type = "comment",
                Target = id.ToString(),
                Reason = reason
            });

            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
