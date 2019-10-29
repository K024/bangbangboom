using bangbangboom.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly AppDbContext context;

        public CommentController(
            UserManager<AppUser> userManager, AppDbContext context)
        {
            this.userManager = userManager;
            this.context = context;
        }

        [HttpGet]
        public async Task<object> Map(
            [FromQuery][Required] long MapId)
        {
            var commentsq =
                from c in context.Comments
                where c.MapId == MapId
                join u in context.Users on c.UserId equals u.Id
                select new CommentInfo(c)
                {
                    user = new AppUserInfo(u),
                };

            return await commentsq.ToListAsync();
        }

        [Authorize]
        [HttpPost]
        public async Task<object> Send(
            [FromForm][Required] long MapId,
            [FromForm] long? ReplyId,
            [FromForm][Required][MaxLength(200)] string comment)
        {
            var user = await userManager.GetUserAsync(User);
            var map = await context.Maps.FindAsync(MapId);
            if (map is null) return StatusCode(404);
            Comment parent = null;
            if (ReplyId != null)
                parent = await context.Comments.FindAsync(ReplyId);

            context.Comments.Add(new Comment()
            {
                UserId = user.Id,
                ParentCommentId = parent?.Id,
                MapId = map.Id,
                Content = comment
            });
            await context.SaveChangesAsync();
            return Ok();
        }


        [Authorize]
        [HttpPost]
        public async Task<object> Delete(
            [FromForm][Required] long id)
        {
            var user = await userManager.GetUserAsync(User);
            var comment = await context.Comments.FindAsync(id);
            if (comment is null) return StatusCode(404);
            if (comment.UserId != user.Id ||
                !await userManager.IsInRoleAsync(user, AppUserRole.Admin))
                return StatusCode(403);

            var children = await (
                from c in context.Comments
                where c.ParentCommentId == id
                select c).CountAsync();

            if (children > 0)
            {
                comment.Locked = true;
                comment.Content = "";
            }
            else
            {
                context.Comments.Remove(comment);
            }
            await context.SaveChangesAsync();
            return Ok();
        }
    }
}
