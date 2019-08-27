﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace bangbangboom.Data
{

    public class Map
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public string UploaderId { get; set; }
        public virtual AppUser Uploader { get; set; }

        public long MusicId { get; set; }
        public virtual Music Music { get; set; }

        [MaxLength(100)]
        public string MapName { get; set; }

        public double Difficulty { get; set; }

        [MaxLength(400)]
        public string Description { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime Date { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime LastModified { get; set; }

        public string MapContent { get; set; }
        [MaxLength(100)]
        public string ImageFileHash { get; set; }

        public bool Proved { get; set; } = false;
        public virtual List<Rate> Rates { get; set; }
        public virtual List<PlayRecord> PlayRecords { get; set; }
        public virtual List<Comment> Comments { get; set; }

        public bool Locked { get; set; } = false;
        public bool Deleted { get; set; } = false;
    }
}
