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
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public long MapId { get; set; }

        public long? ParentCommentId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTimeOffset DateTime { get; set; } = DateTimeOffset.Now;

        [Required]
        [MaxLength(200)]
        public string Content { get; set; }

        public bool Locked { get; set; }
    }

    public class CommentInfo
    {
        public long id;
        public long mapid;
        public AppUserInfo user;
        public long? parentcommentid;
        public DateTimeOffset datetime;
        public string content;
        public bool locked;

        // public CommentInfo() { }
        public CommentInfo(Comment c)
        {
            id = c.Id;
            mapid = c.MapId;
            parentcommentid = c.ParentCommentId;
            datetime = c.DateTime;
            content = c.Content;
            locked = c.Locked;
        }
    }
}
