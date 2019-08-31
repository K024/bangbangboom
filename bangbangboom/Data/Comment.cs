using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{

    public class Comment
    {
        public long Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }

        public long MapId { get; set; }
        public virtual Map Map { get; set; }

        public long? ParentCommentId { get; set; }
        public virtual Comment ParentComment { get; set; }
        public virtual List<Comment> SubComments { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime DateTime { get; set; }

        [Required]
        [MaxLength(200)]
        public string Content { get; set; }

        public bool Locked { get; set; }

        public virtual List<LikeDislike> LikeDislikes { get; set; }
    }

    public class CommentDetail
    {
        public long id;
        public long mapid;
        public AppUserShort user;
        public long? parentcommentid;
        public DateTime datetime;
        public string content;
        public bool locked;
        public int like;
        public int dislike;

        public static CommentDetail FromComment(Comment c, bool admin = false)
        {
            return new CommentDetail()
            {
                id = c.Id,
                mapid = c.MapId,
                user = AppUserShort.FromAppUser(c.User),
                parentcommentid = c.ParentCommentId,
                datetime = c.DateTime,
                content = c.Locked && !admin ? "" : c.Content,
                locked = c.Locked,
                like = c.LikeDislikes.Select(l => !l.IsDislike).Count(),
                dislike = c.LikeDislikes.Select(l => l.IsDislike).Count()
            };
        }
    }
}
