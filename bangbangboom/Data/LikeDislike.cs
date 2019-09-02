﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{
    public class LikeDislike
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; } = 10000;

        [Required]
        public string UserId { get; set; }
        public virtual AppUser User { get; set; }

        public long CommentId { get; set; }
        public virtual Comment Comment { get; set; }

        public bool IsDislike { get; set; } = false;

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime DateTime { get; set; } = DateTime.Now;
    }
}
