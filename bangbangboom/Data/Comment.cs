using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{

    public class Comment
    {
        public long Id { get; set; }

        public string Username { get; set; }
        public virtual AppUser User { get; set; }

        public long MapId { get; set; }
        public virtual Map Map { get; set; }

        public long? ParentCommentId { get; set; }
        public virtual Comment ParentComment { get; set; }
        public virtual List<Comment> SubComments { get; set; }

        public DateTime DateTime { get; set; }
        [MaxLength(200)]
        public string Content { get; set; }

        public bool Locked { get; set; }

        public virtual List<LikeDislike> LikeDislikes { get; set; }
    }
}
